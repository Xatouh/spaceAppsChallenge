// Datos simulados de ciudades
const cityData = {
  valencia: {
    name: "Valencia, España",
    center: [39.4699, -0.3763],
    zoom: 12,
    temperature: 29.0,
    vegetation: 22,
    airQuality: "Moderada",
    zones: [
      { lat: 39.4705, lng: -0.3760, temp: 31, vegetation: 14, population: 8400, airQuality: 86 },
      { lat: 39.4620, lng: -0.3750, temp: 28, vegetation: 30, population: 7200, airQuality: 74 },
      { lat: 39.4780, lng: -0.3880, temp: 30, vegetation: 18, population: 9600, airQuality: 90 }
    ]
  },
  madrid: {
    name: "Madrid, España",
    center: [40.4168, -3.7038],
    zoom: 11,
    temperature: 28.5,
    vegetation: 23,
    airQuality: "Moderada",
    zones: [
      { lat: 40.4200, lng: -3.7100, temp: 32, vegetation: 15, population: 8500, airQuality: 85 },
      { lat: 40.4150, lng: -3.6950, temp: 29, vegetation: 35, population: 6200, airQuality: 72 },
      { lat: 40.4250, lng: -3.7200, temp: 31, vegetation: 18, population: 9100, airQuality: 88 },
      { lat: 40.4100, lng: -3.6900, temp: 27, vegetation: 42, population: 5800, airQuality: 65 },
      { lat: 40.4300, lng: -3.7150, temp: 33, vegetation: 12, population: 9800, airQuality: 92 }
    ]
  },
  barcelona: {
    name: "Barcelona, España",
    center: [41.3851, 2.1734],
    zoom: 11,
    temperature: 26.8,
    vegetation: 28,
    airQuality: "Buena",
    zones: [
      { lat: 41.3900, lng: 2.1800, temp: 30, vegetation: 20, population: 7800, airQuality: 78 },
      { lat: 41.3800, lng: 2.1650, temp: 25, vegetation: 38, population: 5900, airQuality: 62 },
      { lat: 41.3950, lng: 2.1900, temp: 28, vegetation: 25, population: 8200, airQuality: 75 }
    ]
  },
  bogota: {
    name: "Bogotá, Colombia",
    center: [4.7110, -74.0721],
    zoom: 10,
    temperature: 19.2,
    vegetation: 31,
    airQuality: "Moderada",
    zones: [
      { lat: 4.7200, lng: -74.0800, temp: 22, vegetation: 25, population: 9200, airQuality: 82 },
      { lat: 4.7000, lng: -74.0600, temp: 18, vegetation: 45, population: 6500, airQuality: 68 },
      { lat: 4.7300, lng: -74.0900, temp: 21, vegetation: 28, population: 8800, airQuality: 79 }
    ]
  },
  mexico: {
    name: "Ciudad de México",
    center: [19.4326, -99.1332],
    zoom: 10,
    temperature: 22.5,
    vegetation: 19,
    airQuality: "Mala",
    zones: [
      { lat: 19.4400, lng: -99.1400, temp: 25, vegetation: 15, population: 11200, airQuality: 95 },
      { lat: 19.4200, lng: -99.1200, temp: 21, vegetation: 28, population: 8900, airQuality: 87 },
      { lat: 19.4500, lng: -99.1500, temp: 24, vegetation: 12, population: 12500, airQuality: 98 }
    ]
  },
  lima: {
    name: "Lima, Perú",
    center: [-12.0464, -77.0428],
    zoom: 10,
    temperature: 20.8,
    vegetation: 16,
    airQuality: "Moderada",
    zones: [
      { lat: -12.0500, lng: -77.0500, temp: 23, vegetation: 12, population: 10500, airQuality: 85 },
      { lat: -12.0400, lng: -77.0300, temp: 19, vegetation: 22, population: 7800, airQuality: 72 },
      { lat: -12.0600, lng: -77.0600, temp: 22, vegetation: 14, population: 9800, airQuality: 88 }
    ]
  }
};

class UrbanTreePlanner {
  constructor() {
    this.map = null;
    this.currentCity = 'valencia';
    this.layers = {
      temperature: null,
      vegetation: null,
      population: null,
      airQuality: null,
      recommendations: null
    };
    this.markers = [];
    
    this.init();
  }

  init() {
    this.initMap();
    this.bindEvents();
    this.loadCity(this.currentCity);
  }

  initMap() {
    this.map = L.map('map').setView([40.4168, -3.7038], 11);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  bindEvents() {
    // Selector de ciudad
    document.getElementById('city-select').addEventListener('change', (e) => {
      this.currentCity = e.target.value;
      this.loadCity(this.currentCity);
    });

    // Controles de capas
    document.getElementById('temperature-layer').addEventListener('change', (e) => {
      this.toggleLayer('temperature', e.target.checked);
    });

    document.getElementById('vegetation-layer').addEventListener('change', (e) => {
      this.toggleLayer('vegetation', e.target.checked);
    });

    document.getElementById('population-layer').addEventListener('change', (e) => {
      this.toggleLayer('population', e.target.checked);
    });

    document.getElementById('air-quality-layer').addEventListener('change', (e) => {
      this.toggleLayer('airQuality', e.target.checked);
    });

    // Botón de análisis
    document.getElementById('analyze-btn').addEventListener('click', () => {
      this.analyzeOptimalZones();
    });

    // Botón de reporte
    document.getElementById('generate-report-btn').addEventListener('click', () => {
      this.generateReport();
    });

    // Modal
    document.querySelector('.close').addEventListener('click', () => {
      document.getElementById('report-modal').style.display = 'none';
    });

    window.addEventListener('click', (e) => {
      const modal = document.getElementById('report-modal');
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }

  loadCity(cityKey) {
    const city = cityData[cityKey];
    if (!city) return;

    // Actualizar vista del mapa
    this.map.setView(city.center, city.zoom);

    // Limpiar marcadores existentes
    this.clearMarkers();

    // Actualizar métricas
    this.updateMetrics(city);

    // Cargar capas activas
    this.loadActiveLayers(city);
  }

  updateMetrics(city) {
    document.getElementById('avg-temperature').textContent = `${city.temperature}°C`;
    document.getElementById('vegetation-coverage').textContent = `${city.vegetation}%`;
    document.getElementById('air-quality-index').textContent = city.airQuality;
  }

  loadActiveLayers(city) {
    const temperatureActive = document.getElementById('temperature-layer').checked;
    const vegetationActive = document.getElementById('vegetation-layer').checked;
    const populationActive = document.getElementById('population-layer').checked;
    const airQualityActive = document.getElementById('air-quality-layer').checked;

    if (temperatureActive) this.loadTemperatureLayer(city);
    if (vegetationActive) this.loadVegetationLayer(city);
    if (populationActive) this.loadPopulationLayer(city);
    if (airQualityActive) this.loadAirQualityLayer(city);
  }

  loadTemperatureLayer(city) {
    this.clearLayer('temperature');
    
    city.zones.forEach(zone => {
      const color = this.getTemperatureColor(zone.temp);
      const circle = L.circle([zone.lat, zone.lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.6,
        radius: 800
      }).addTo(this.map);

      circle.bindPopup(`
        <strong>Temperatura: ${zone.temp}°C</strong><br>
        Vegetación: ${zone.vegetation}%<br>
        Población: ${zone.population}/km²
      `);

      this.markers.push(circle);
    });
  }

  loadVegetationLayer(city) {
    this.clearLayer('vegetation');
    
    city.zones.forEach(zone => {
      const color = this.getVegetationColor(zone.vegetation);
      const circle = L.circle([zone.lat, zone.lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.4,
        radius: 600
      }).addTo(this.map);

      circle.bindPopup(`
        <strong>Vegetación: ${zone.vegetation}%</strong><br>
        Temperatura: ${zone.temp}°C<br>
        Calidad del aire: ${zone.airQuality} AQI
      `);

      this.markers.push(circle);
    });
  }

  loadPopulationLayer(city) {
    this.clearLayer('population');
    
    city.zones.forEach(zone => {
      const size = this.getPopulationSize(zone.population);
      const circle = L.circle([zone.lat, zone.lng], {
        color: '#6c757d',
        fillColor: '#6c757d',
        fillOpacity: 0.3,
        radius: size
      }).addTo(this.map);

      circle.bindPopup(`
        <strong>Densidad: ${zone.population}/km²</strong><br>
        Temperatura: ${zone.temp}°C<br>
        Vegetación: ${zone.vegetation}%
      `);

      this.markers.push(circle);
    });
  }

  loadAirQualityLayer(city) {
    this.clearLayer('airQuality');
    
    city.zones.forEach(zone => {
      const color = this.getAirQualityColor(zone.airQuality);
      const circle = L.circle([zone.lat, zone.lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.5,
        radius: 700
      }).addTo(this.map);

      circle.bindPopup(`
        <strong>Calidad del Aire: ${zone.airQuality} AQI</strong><br>
        Temperatura: ${zone.temp}°C<br>
        Vegetación: ${zone.vegetation}%
      `);

      this.markers.push(circle);
    });
  }

  toggleLayer(layerType, active) {
    if (!active) {
      this.clearLayer(layerType);
    } else {
      const city = cityData[this.currentCity];
      switch(layerType) {
        case 'temperature':
          this.loadTemperatureLayer(city);
          break;
        case 'vegetation':
          this.loadVegetationLayer(city);
          break;
        case 'population':
          this.loadPopulationLayer(city);
          break;
        case 'airQuality':
          this.loadAirQualityLayer(city);
          break;
      }
    }
  }

  analyzeOptimalZones() {
    const city = cityData[this.currentCity];
    const recommendations = this.calculateRecommendations(city);
    
    this.displayRecommendations(recommendations);
    this.showRecommendedZones(recommendations);
  }

  calculateRecommendations(city) {
    const recommendations = [];
    
    city.zones.forEach((zone, index) => {
      const score = this.calculatePlantingScore(zone);
      const priority = this.getPriority(score);
      
      recommendations.push({
        id: index,
        zone: zone,
        score: score,
        priority: priority,
        reason: this.getRecommendationReason(zone, score)
      });
    });

    return recommendations.sort((a, b) => b.score - a.score);
  }

  calculatePlantingScore(zone) {
    let score = 0;
    
    // Temperatura alta aumenta la necesidad
    if (zone.temp > 30) score += 40;
    else if (zone.temp > 25) score += 25;
    else score += 10;
    
    // Baja vegetación aumenta la necesidad
    if (zone.vegetation < 20) score += 35;
    else if (zone.vegetation < 35) score += 20;
    else score += 5;
    
    // Alta densidad poblacional aumenta la necesidad
    if (zone.population > 9000) score += 30;
    else if (zone.population > 7000) score += 20;
    else score += 10;
    
    // Mala calidad del aire aumenta la necesidad
    if (zone.airQuality > 85) score += 25;
    else if (zone.airQuality > 70) score += 15;
    else score += 5;
    
    return Math.min(score, 100);
  }

  getPriority(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  }

  getRecommendationReason(zone, score) {
    const reasons = [];
    
    if (zone.temp > 30) reasons.push('temperatura muy alta');
    if (zone.vegetation < 20) reasons.push('baja cobertura vegetal');
    if (zone.population > 9000) reasons.push('alta densidad poblacional');
    if (zone.airQuality > 85) reasons.push('mala calidad del aire');
    
    return reasons.join(', ');
  }

  displayRecommendations(recommendations) {
    const container = document.getElementById('recommendations-content');
    
    if (recommendations.length === 0) {
      container.innerHTML = '<p>No se encontraron zonas para análisis.</p>';
      return;
    }

    let html = '';
    recommendations.slice(0, 3).forEach((rec, index) => {
      html += `
        <div class="recommendation-item priority-${rec.priority}">
          <h4>Zona ${index + 1} - Prioridad ${rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Baja'}</h4>
          <p><strong>Puntuación:</strong> ${rec.score}/100</p>
          <p><strong>Razones:</strong> ${rec.reason}</p>
          <p><strong>Estrategia Recomendada:</strong> ${this.getRecommendedSpecies(rec.zone)}</p>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  getRecommendedSpecies(zone) {
    // Estrategias posibles y puntuación inicial
    const strategies = {
      'Plantación de Árboles': 0,
      'Jardín Vertical': 0,
      'Tejado Verde': 0,
      'Toldo Verde': 0
    };

    // Normalizar AQI si viene como texto
    let aqi = zone.airQuality;
    if (typeof aqi === 'string') {
      const map = { 'mala': 90, 'moderada': 75, 'buena': 50, 'bueno': 50 };
      aqi = map[aqi.toLowerCase()] ?? 75;
    }

    // Determinar disponibilidad de espacio: usar zone.availableSpace si existe,
    // si no, inferir desde población y cobertura vegetal
    let space = (zone.availableSpace || '').toString().toLowerCase();
    if (!space) {
      if (zone.population > 9000 && zone.vegetation < 25) space = 'low';
      else if (zone.population > 7000 && zone.vegetation < 35) space = 'medium';
      else space = 'high';
    }

    // Helper para sumar puntos
    const add = (k, v) => { strategies[k] = (strategies[k] || 0) + v; };

    // Reglas por temperatura (mayor calor favorece soluciones que mitigen radiación inmediata)
    if (zone.temp > 30) {
      add('Jardín Vertical', 28);
      add('Toldo Verde', 24);
      add('Tejado Verde', 20);
      add('Plantación de Árboles', space === 'high' ? 18 : 6);
    } else if (zone.temp > 25) {
      add('Plantación de Árboles', space === 'high' ? 20 : 10);
      add('Toldo Verde', 14);
      add('Jardín Vertical', 10);
    } else {
      add('Plantación de Árboles', space === 'high' ? 12 : 5);
      add('Tejado Verde', 8);
    }

    // Reglas por cobertura vegetal (si es baja, se necesita aumentar cobertura;
    // si no hay espacio en suelo, priorizar vertical/tejado)
    if (zone.vegetation < 20) {
      if (space === 'low') {
        add('Jardín Vertical', 30);
        add('Toldo Verde', 20);
        add('Tejado Verde', 18);
        add('Plantación de Árboles', -15);
      } else if (space === 'medium') {
        add('Plantación de Árboles', 18);
        add('Jardín Vertical', 18);
        add('Tejado Verde', 12);
      } else { // high
        add('Plantación de Árboles', 30);
        add('Jardín Vertical', 15);
        add('Tejado Verde', 12);
      }
    } else if (zone.vegetation < 35) {
      add('Plantación de Árboles', 12);
      add('Jardín Vertical', 10);
    }

    // Reglas por densidad poblacional (en zonas muy densas, sombra inmediata y soluciones modulares)
    if (zone.population > 9000) {
      if (space === 'high') {
        add('Plantación de Árboles', 22);
        add('Toldo Verde', 18);
      } else {
        add('Toldo Verde', 22);
        add('Jardín Vertical', 18);
      }
    } else if (zone.population > 7000) {
      add('Plantación de Árboles', space === 'high' ? 15 : 8);
      add('Toldo Verde', 10);
    }

    // Reglas por calidad del aire (vegetación en suelo y vertical mejora filtrado)
    if (aqi > 85) {
      add('Plantación de Árboles', 26);
      add('Jardín Vertical', 20);
    } else if (aqi > 70) {
      add('Plantación de Árboles', 14);
      add('Jardín Vertical', 10);
    }

    // Heurística final: si hay muy poco espacio, penalizar plantaciones en suelo
    if (space === 'low') {
      add('Plantación de Árboles', -20);
      add('Jardín Vertical', 10);
      add('Toldo Verde', 10);
    } else if (space === 'medium') {
      add('Plantación de Árboles', -5);
    } else { // high
      add('Plantación de Árboles', 12);
    }

    // Evitar puntuaciones negativas y normalizar
    Object.keys(strategies).forEach(k => { if (strategies[k] < 0) strategies[k] = 0; });

    // Ordenar y devolver las 3 estrategias mejor puntuadas
    const ordered = Object.entries(strategies)
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);

    return ordered.slice(0, 3).join(', ');
  }

  showRecommendedZones(recommendations) {
    // Limpiar zonas recomendadas anteriores
    this.clearLayer('recommendations');
    
    recommendations.slice(0, 3).forEach(rec => {
      const zone = rec.zone;
      const color = rec.priority === 'high' ? '#dc3545' : rec.priority === 'medium' ? '#fd7e14' : '#28a745';
      
      const circle = L.circle([zone.lat, zone.lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.3,
        radius: 1000,
        weight: 3,
        dashArray: '10, 10'
      }).addTo(this.map);

      // obtener estrategias recomendadas como array
      const strategies = this.getRecommendedSpecies(zone).split(',').map(s => s.trim()).filter(Boolean);
      const primary = strategies[0] || '';
      const url = primary ? `strategies.html?strategy=${encodeURIComponent(primary)}` : 'strategies.html';

      circle.bindPopup(`
        <strong>Zona Recomendada</strong><br>
        Prioridad: ${rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Baja'}<br>
        Puntuación: ${rec.score}/100<br>
        Estrategia: ${strategies.join(', ')}<br><br>
        <a href="${url}" target="_blank" rel="noopener" style="display:inline-block;padding:6px 10px;background:#2c5530;color:#fff;border-radius:6px;text-decoration:none;">Ver más</a>
      `);

      this.markers.push(circle);
    });
  }

  generateReport() {
    const city = cityData[this.currentCity];
    const recommendations = this.calculateRecommendations(city);
    
    const reportContent = `
      <div class="report-section">
        <h3>Resumen Ejecutivo - ${city.name}</h3>
        <div class="data-grid">
          <div class="data-card">
            <h4>Temperatura Promedio</h4>
            <div class="value">${city.temperature}°C</div>
          </div>
          <div class="data-card">
            <h4>Cobertura Vegetal</h4>
            <div class="value">${city.vegetation}%</div>
          </div>
          <div class="data-card">
            <h4>Calidad del Aire</h4>
            <div class="value">${city.airQuality}</div>
          </div>
          <div class="data-card">
            <h4>Zonas Analizadas</h4>
            <div class="value">${city.zones.length}</div>
          </div>
        </div>
      </div>

      <div class="report-section">
        <h3>Recomendaciones Prioritarias</h3>
        ${recommendations.slice(0, 5).map((rec, index) => `
          <div class="recommendation-item priority-${rec.priority}">
            <h4>Zona ${index + 1}</h4>
            <p><strong>Coordenadas:</strong> ${rec.zone.lat.toFixed(4)}, ${rec.zone.lng.toFixed(4)}</p>
            <p><strong>Puntuación:</strong> ${rec.score}/100</p>
            <p><strong>Temperatura:</strong> ${rec.zone.temp}°C</p>
            <p><strong>Vegetación actual:</strong> ${rec.zone.vegetation}%</p>
            <p><strong>Densidad poblacional:</strong> ${rec.zone.population}/km²</p>
            <p><strong>Especies recomendadas:</strong> ${this.getRecommendedSpecies(rec.zone)}</p>
          </div>
        `).join('')}
      </div>

      <div class="report-section">
        <h3>Impacto Proyectado</h3>
        <p>La implementación de estas recomendaciones podría resultar en:</p>
        <ul>
          <li>Reducción de temperatura promedio: 2-4°C</li>
          <li>Mejora en calidad del aire: 15-25%</li>
          <li>Aumento de cobertura vegetal: 10-15%</li>
          <li>Beneficio para ${city.zones.reduce((sum, zone) => sum + zone.population, 0).toLocaleString()} habitantes</li>
        </ul>
      </div>
    `;

    document.getElementById('report-content').innerHTML = reportContent;
    document.getElementById('report-modal').style.display = 'block';
  }

  clearMarkers() {
    this.markers.forEach(marker => {
      this.map.removeLayer(marker);
    });
    this.markers = [];
  }

  clearLayer(layerType) {
    // Esta función se puede expandir para manejar capas específicas
    // Por ahora, limpiamos todos los marcadores cuando se desactiva una capa
  }

  getTemperatureColor(temp) {
    if (temp > 30) return '#dc3545';
    if (temp > 25) return '#fd7e14';
    return '#20c997';
  }

  getVegetationColor(vegetation) {
    if (vegetation > 35) return '#28a745';
    if (vegetation > 20) return '#6f9654';
    return '#8b4513';
  }

  getPopulationSize(population) {
    if (population > 9000) return 1200;
    if (population > 7000) return 900;
    return 600;
  }

  getAirQualityColor(aqi) {
    if (aqi > 85) return '#dc3545';
    if (aqi > 70) return '#fd7e14';
    return '#28a745';
  }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
  new UrbanTreePlanner();
});

    (function(){
      const toggle = document.getElementById('menu-toggle');
      const sidebar = document.querySelector('.sidebar');
      const backdrop = document.getElementById('sidebar-backdrop');

      if (!toggle || !sidebar || !backdrop) return;

      function openSidebar(){
        sidebar.classList.add('open');
        backdrop.classList.add('visible');
        document.body.style.overflow = 'hidden';
      }
      function closeSidebar(){
        sidebar.classList.remove('open');
        backdrop.classList.remove('visible');
        document.body.style.overflow = '';
      }

      toggle.addEventListener('click', (e) => {
        if (sidebar.classList.contains('open')) closeSidebar();
        else openSidebar();
      });

      backdrop.addEventListener('click', closeSidebar);

      // Cerrar al cambiar de ciudad o al iniciar análisis (mejora UX)
      const citySelect = document.getElementById('city-select');
      const analyzeBtn = document.getElementById('analyze-btn');
      if (citySelect) citySelect.addEventListener('change', closeSidebar);
      if (analyzeBtn) analyzeBtn.addEventListener('click', closeSidebar);
    })();
