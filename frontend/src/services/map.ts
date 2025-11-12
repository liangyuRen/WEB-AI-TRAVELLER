/**
 * Map Services
 * 使用开源的Leaflet和OpenStreetMap
 */

import L from 'leaflet';

export class MapService {
  private map: L.Map | null = null;
  private markers: L.Marker[] = [];

  /**
   * 初始化地图
   */
  initializeMap(elementId: string, lat: number = 39.9042, lng: number = 116.4074): L.Map {
    // 清理旧地图
    if (this.map) {
      this.map.remove();
    }

    // 创建地图
    this.map = L.map(elementId).setView([lat, lng], 13);

    // 添加OpenStreetMap图层
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);

    return this.map;
  }

  /**
   * 添加标记
   */
  addMarker(lat: number, lng: number, label: string, description?: string): L.Marker {
    if (!this.map) {
      throw new Error('Map not initialized');
    }

    const marker = L.marker([lat, lng])
      .addTo(this.map)
      .bindPopup(`<b>${label}</b>${description ? `<br/>${description}` : ''}`);

    this.markers.push(marker);
    return marker;
  }

  /**
   * 清除所有标记
   */
  clearMarkers(): void {
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
  }

  /**
   * 设置地图中心和缩放级别
   */
  setView(lat: number, lng: number, zoom: number = 13): void {
    if (this.map) {
      this.map.setView([lat, lng], zoom);
    }
  }

  /**
   * 获取地图实例
   */
  getMap(): L.Map | null {
    return this.map;
  }

  /**
   * 地址搜索（使用OpenStreetMap Nominatim）
   */
  async searchLocation(query: string): Promise<any[]> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      return await response.json();
    } catch (error) {
      console.error('Location search error:', error);
      return [];
    }
  }

  /**
   * 获取两点之间的距离
   */
  getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // 地球半径（公里）
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}

// 常见城市坐标
export const CITY_COORDINATES: Record<string, [number, number]> = {
  '北京': [39.9042, 116.4074],
  '上海': [31.2304, 121.4737],
  '广州': [23.1291, 113.2644],
  '深圳': [22.5431, 114.0579],
  '杭州': [30.2741, 120.1551],
  '成都': [30.5728, 104.0668],
  '西安': [34.3416, 109.0674],
  '重庆': [29.5630, 106.5516],
  '南京': [32.0603, 118.7969],
  '武汉': [30.5928, 114.3055],
  '苏州': [31.2989, 120.5954],
  '天津': [39.0842, 117.2010],
  '长沙': [28.2282, 112.9388],
  '沈阳': [41.8045, 123.4328],
  '青岛': [36.0671, 120.3826],
  '郑州': [34.7466, 113.6253],
  '东京': [35.6762, 139.6503],
  '大阪': [34.6937, 135.5023],
  '京都': [35.0116, 135.7681],
  '巴黎': [48.8566, 2.3522],
  '伦敦': [51.5074, -0.1278],
  '纽约': [40.7128, -74.0060],
  '洛杉矶': [34.0522, -118.2437],
  '曼谷': [13.7563, 100.5018],
  '吉隆坡': [3.1390, 101.6869],
  '新加坡': [1.3521, 103.8198],
  '台北': [25.0330, 121.5654],
  '香港': [22.3193, 114.1694],
};

export const mapService = new MapService();

export default MapService;
