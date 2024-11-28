import tkinter as tk
from tkinter import messagebox
from tkinter import ttk
import osmnx as ox
import networkx as nx
import folium
import webview
from simpleai.search import SearchProblem
import tempfile
import threading

# Class định nghĩa vấn đề tìm đường
class RouteFindingProblem(SearchProblem):
    def __init__(self, G, start_node, end_node):
        self.G = G
        self.start_node = start_node
        self.end_node = end_node
        super().__init__(initial_state=start_node)

    def actions(self, state):
        return list(self.G[state].keys())

    def result(self, state, action):
        return action

    def is_goal(self, state):
        return state == self.end_node

    def cost(self, state1, action, state2):
        return self.G[state1][state2][0]['length']


# Hàm tải bản đồ
def load_map(callback):
    def _load():
        try:
            update_status("Đang tải bản đồ Thủ Đức, vui lòng chờ...")
            G = ox.graph_from_place("Thu Duc, Ho Chi Minh City, Vietnam", network_type="drive")
            update_status("Bản đồ đã tải thành công!")
            callback(G)
        except Exception as e:
            update_status("Lỗi tải bản đồ.")
            messagebox.showerror("Lỗi tải bản đồ", str(e))
    threading.Thread(target=_load).start()


# Hàm tìm đường
def find_route_on_map(start_location, end_location, G, callback):
    try:
        start_point = ox.geocode(start_location)
        end_point = ox.geocode(end_location)

        start_node = ox.distance.nearest_nodes(G, start_point[1], start_point[0])
        end_node = ox.distance.nearest_nodes(G, end_point[1], end_point[0])

        problem = RouteFindingProblem(G, start_node, end_node)
        result = nx.shortest_path(G, start_node, end_node, weight="length")

        route_coords = [(G.nodes[node]['y'], G.nodes[node]['x']) for node in result]
        map_center = [(start_point[0] + end_point[0]) / 2, (start_point[1] + end_point[1]) / 2]
        route_map = folium.Map(location=map_center, zoom_start=14)

        folium.PolyLine(route_coords, color="blue", weight=5, opacity=0.8).add_to(route_map)
        folium.Marker(location=start_point, popup="Điểm bắt đầu", icon=folium.Icon(color="green")).add_to(route_map)
        folium.Marker(location=end_point, popup="Điểm kết thúc", icon=folium.Icon(color="red")).add_to(route_map)

        for coord in route_coords[::int(len(route_coords) / 10)]:
            folium.Marker(location=coord, icon=folium.Icon(color="blue", icon="info-sign")).add_to(route_map)

        with tempfile.NamedTemporaryFile(delete=False, suffix=".html") as tmp:
            route_map.save(tmp.name)
            callback(tmp.name)

    except Exception as e:
        messagebox.showerror("Lỗi tìm đường", str(e))


# Hàm hiển thị bản đồ
def display_map(file_path):
    # Sử dụng Tkinter's after để chạy trong luồng chính
    root.after(0, lambda: webview.create_window("Route Map", file_path))
    root.after(100, webview.start)


# Hàm cập nhật trạng thái giao diện
def update_status(message):
    status_label.config(text=message)


# Hàm xử lý khi tải bản đồ xong
def on_map_loaded(graph):
    global G
    G = graph
    find_button.config(state=tk.NORMAL)

# Hàm xử lý khi nhấn nút "Tìm Đường"
def handle_find_route():
    start_location = start_entry.get()
    end_location = end_entry.get()

    if not start_location or not end_location:
        messagebox.showwarning("Cảnh báo", "Bạn phải nhập cả hai địa điểm!")
        return

    threading.Thread(target=find_route_on_map, args=(start_location, end_location, G, display_map)).start()


# Giao diện Tkinter
root = tk.Tk()
root.title("Tìm Đường và Hiển Thị Bản Đồ")

frame = ttk.Frame(root, padding="10")
frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))

status_label = ttk.Label(frame, text="Đang khởi động...")
status_label.grid(row=0, column=0, columnspan=2, sticky=tk.W, pady=5)

ttk.Label(frame, text="Nhập địa chỉ hoặc tên nơi bắt đầu:").grid(row=1, column=0, sticky=tk.W, pady=5)
start_entry = ttk.Entry(frame, width=50)
start_entry.grid(row=1, column=1, pady=5)

ttk.Label(frame, text="Nhập địa chỉ hoặc tên nơi kết thúc:").grid(row=2, column=0, sticky=tk.W, pady=5)
end_entry = ttk.Entry(frame, width=50)
end_entry.grid(row=2, column=1, pady=5)

find_button = ttk.Button(frame, text="Tìm Đường", state=tk.DISABLED, command=handle_find_route)
find_button.grid(row=3, column=0, columnspan=2, pady=10)

# Bắt đầu tải bản đồ ngay khi khởi động
load_map(on_map_loaded)

root.mainloop()
