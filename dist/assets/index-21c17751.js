(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(a){if(a.ep)return;a.ep=!0;const r=t(a);fetch(a.href,r)}})();const n={madrid:{name:"Madrid, España",center:[40.4168,-3.7038],zoom:11,temperature:28.5,vegetation:23,airQuality:"Moderada",zones:[{lat:40.42,lng:-3.71,temp:32,vegetation:15,population:8500,airQuality:85},{lat:40.415,lng:-3.695,temp:29,vegetation:35,population:6200,airQuality:72},{lat:40.425,lng:-3.72,temp:31,vegetation:18,population:9100,airQuality:88},{lat:40.41,lng:-3.69,temp:27,vegetation:42,population:5800,airQuality:65},{lat:40.43,lng:-3.715,temp:33,vegetation:12,population:9800,airQuality:92}]},barcelona:{name:"Barcelona, España",center:[41.3851,2.1734],zoom:11,temperature:26.8,vegetation:28,airQuality:"Buena",zones:[{lat:41.39,lng:2.18,temp:30,vegetation:20,population:7800,airQuality:78},{lat:41.38,lng:2.165,temp:25,vegetation:38,population:5900,airQuality:62},{lat:41.395,lng:2.19,temp:28,vegetation:25,population:8200,airQuality:75}]},bogota:{name:"Bogotá, Colombia",center:[4.711,-74.0721],zoom:10,temperature:19.2,vegetation:31,airQuality:"Moderada",zones:[{lat:4.72,lng:-74.08,temp:22,vegetation:25,population:9200,airQuality:82},{lat:4.7,lng:-74.06,temp:18,vegetation:45,population:6500,airQuality:68},{lat:4.73,lng:-74.09,temp:21,vegetation:28,population:8800,airQuality:79}]},mexico:{name:"Ciudad de México",center:[19.4326,-99.1332],zoom:10,temperature:22.5,vegetation:19,airQuality:"Mala",zones:[{lat:19.44,lng:-99.14,temp:25,vegetation:15,population:11200,airQuality:95},{lat:19.42,lng:-99.12,temp:21,vegetation:28,population:8900,airQuality:87},{lat:19.45,lng:-99.15,temp:24,vegetation:12,population:12500,airQuality:98}]},lima:{name:"Lima, Perú",center:[-12.0464,-77.0428],zoom:10,temperature:20.8,vegetation:16,airQuality:"Moderada",zones:[{lat:-12.05,lng:-77.05,temp:23,vegetation:12,population:10500,airQuality:85},{lat:-12.04,lng:-77.03,temp:19,vegetation:22,population:7800,airQuality:72},{lat:-12.06,lng:-77.06,temp:22,vegetation:14,population:9800,airQuality:88}]}};class s{constructor(){this.map=null,this.currentCity="madrid",this.layers={temperature:null,vegetation:null,population:null,airQuality:null,recommendations:null},this.markers=[],this.init()}init(){this.initMap(),this.bindEvents(),this.loadCity(this.currentCity)}initMap(){this.map=L.map("map").setView([40.4168,-3.7038],11),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}).addTo(this.map)}bindEvents(){document.getElementById("city-select").addEventListener("change",e=>{this.currentCity=e.target.value,this.loadCity(this.currentCity)}),document.getElementById("temperature-layer").addEventListener("change",e=>{this.toggleLayer("temperature",e.target.checked)}),document.getElementById("vegetation-layer").addEventListener("change",e=>{this.toggleLayer("vegetation",e.target.checked)}),document.getElementById("population-layer").addEventListener("change",e=>{this.toggleLayer("population",e.target.checked)}),document.getElementById("air-quality-layer").addEventListener("change",e=>{this.toggleLayer("airQuality",e.target.checked)}),document.getElementById("analyze-btn").addEventListener("click",()=>{this.analyzeOptimalZones()}),document.getElementById("generate-report-btn").addEventListener("click",()=>{this.generateReport()}),document.querySelector(".close").addEventListener("click",()=>{document.getElementById("report-modal").style.display="none"}),window.addEventListener("click",e=>{const t=document.getElementById("report-modal");e.target===t&&(t.style.display="none")})}loadCity(e){const t=n[e];t&&(this.map.setView(t.center,t.zoom),this.clearMarkers(),this.updateMetrics(t),this.loadActiveLayers(t))}updateMetrics(e){document.getElementById("avg-temperature").textContent=`${e.temperature}°C`,document.getElementById("vegetation-coverage").textContent=`${e.vegetation}%`,document.getElementById("air-quality-index").textContent=e.airQuality}loadActiveLayers(e){const t=document.getElementById("temperature-layer").checked,i=document.getElementById("vegetation-layer").checked,a=document.getElementById("population-layer").checked,r=document.getElementById("air-quality-layer").checked;t&&this.loadTemperatureLayer(e),i&&this.loadVegetationLayer(e),a&&this.loadPopulationLayer(e),r&&this.loadAirQualityLayer(e)}loadTemperatureLayer(e){this.clearLayer("temperature"),e.zones.forEach(t=>{const i=this.getTemperatureColor(t.temp),a=L.circle([t.lat,t.lng],{color:i,fillColor:i,fillOpacity:.6,radius:800}).addTo(this.map);a.bindPopup(`
        <strong>Temperatura: ${t.temp}°C</strong><br>
        Vegetación: ${t.vegetation}%<br>
        Población: ${t.population}/km²
      `),this.markers.push(a)})}loadVegetationLayer(e){this.clearLayer("vegetation"),e.zones.forEach(t=>{const i=this.getVegetationColor(t.vegetation),a=L.circle([t.lat,t.lng],{color:i,fillColor:i,fillOpacity:.4,radius:600}).addTo(this.map);a.bindPopup(`
        <strong>Vegetación: ${t.vegetation}%</strong><br>
        Temperatura: ${t.temp}°C<br>
        Calidad del aire: ${t.airQuality} AQI
      `),this.markers.push(a)})}loadPopulationLayer(e){this.clearLayer("population"),e.zones.forEach(t=>{const i=this.getPopulationSize(t.population),a=L.circle([t.lat,t.lng],{color:"#6c757d",fillColor:"#6c757d",fillOpacity:.3,radius:i}).addTo(this.map);a.bindPopup(`
        <strong>Densidad: ${t.population}/km²</strong><br>
        Temperatura: ${t.temp}°C<br>
        Vegetación: ${t.vegetation}%
      `),this.markers.push(a)})}loadAirQualityLayer(e){this.clearLayer("airQuality"),e.zones.forEach(t=>{const i=this.getAirQualityColor(t.airQuality),a=L.circle([t.lat,t.lng],{color:i,fillColor:i,fillOpacity:.5,radius:700}).addTo(this.map);a.bindPopup(`
        <strong>Calidad del Aire: ${t.airQuality} AQI</strong><br>
        Temperatura: ${t.temp}°C<br>
        Vegetación: ${t.vegetation}%
      `),this.markers.push(a)})}toggleLayer(e,t){if(!t)this.clearLayer(e);else{const i=n[this.currentCity];switch(e){case"temperature":this.loadTemperatureLayer(i);break;case"vegetation":this.loadVegetationLayer(i);break;case"population":this.loadPopulationLayer(i);break;case"airQuality":this.loadAirQualityLayer(i);break}}}analyzeOptimalZones(){const e=n[this.currentCity],t=this.calculateRecommendations(e);this.displayRecommendations(t),this.showRecommendedZones(t)}calculateRecommendations(e){const t=[];return e.zones.forEach((i,a)=>{const r=this.calculatePlantingScore(i),o=this.getPriority(r);t.push({id:a,zone:i,score:r,priority:o,reason:this.getRecommendationReason(i,r)})}),t.sort((i,a)=>a.score-i.score)}calculatePlantingScore(e){let t=0;return e.temp>30?t+=40:e.temp>25?t+=25:t+=10,e.vegetation<20?t+=35:e.vegetation<35?t+=20:t+=5,e.population>9e3?t+=30:e.population>7e3?t+=20:t+=10,e.airQuality>85?t+=25:e.airQuality>70?t+=15:t+=5,Math.min(t,100)}getPriority(e){return e>=80?"high":e>=60?"medium":"low"}getRecommendationReason(e,t){const i=[];return e.temp>30&&i.push("temperatura muy alta"),e.vegetation<20&&i.push("baja cobertura vegetal"),e.population>9e3&&i.push("alta densidad poblacional"),e.airQuality>85&&i.push("mala calidad del aire"),i.join(", ")}displayRecommendations(e){const t=document.getElementById("recommendations-content");if(e.length===0){t.innerHTML="<p>No se encontraron zonas para análisis.</p>";return}let i="";e.slice(0,3).forEach((a,r)=>{i+=`
        <div class="recommendation-item priority-${a.priority}">
          <h4>Zona ${r+1} - Prioridad ${a.priority==="high"?"Alta":a.priority==="medium"?"Media":"Baja"}</h4>
          <p><strong>Puntuación:</strong> ${a.score}/100</p>
          <p><strong>Razones:</strong> ${a.reason}</p>
          <p><strong>Especies recomendadas:</strong> ${this.getRecommendedSpecies(a.zone)}</p>
        </div>
      `}),t.innerHTML=i}getRecommendedSpecies(e){const t=[];return e.temp>30?t.push("Jacaranda","Ceiba"):e.temp>25?t.push("Roble","Arce"):t.push("Pino","Abeto"),e.airQuality>80&&t.push("Tilo","Fresno"),t.slice(0,3).join(", ")}showRecommendedZones(e){this.clearLayer("recommendations"),e.slice(0,3).forEach(t=>{const i=t.zone,a=t.priority==="high"?"#dc3545":t.priority==="medium"?"#fd7e14":"#28a745",r=L.circle([i.lat,i.lng],{color:a,fillColor:a,fillOpacity:.3,radius:1e3,weight:3,dashArray:"10, 10"}).addTo(this.map);r.bindPopup(`
        <strong>Zona Recomendada</strong><br>
        Prioridad: ${t.priority==="high"?"Alta":t.priority==="medium"?"Media":"Baja"}<br>
        Puntuación: ${t.score}/100<br>
        Especies: ${this.getRecommendedSpecies(i)}
      `),this.markers.push(r)})}generateReport(){const e=n[this.currentCity],t=this.calculateRecommendations(e),i=`
      <div class="report-section">
        <h3>Resumen Ejecutivo - ${e.name}</h3>
        <div class="data-grid">
          <div class="data-card">
            <h4>Temperatura Promedio</h4>
            <div class="value">${e.temperature}°C</div>
          </div>
          <div class="data-card">
            <h4>Cobertura Vegetal</h4>
            <div class="value">${e.vegetation}%</div>
          </div>
          <div class="data-card">
            <h4>Calidad del Aire</h4>
            <div class="value">${e.airQuality}</div>
          </div>
          <div class="data-card">
            <h4>Zonas Analizadas</h4>
            <div class="value">${e.zones.length}</div>
          </div>
        </div>
      </div>

      <div class="report-section">
        <h3>Recomendaciones Prioritarias</h3>
        ${t.slice(0,5).map((a,r)=>`
          <div class="recommendation-item priority-${a.priority}">
            <h4>Zona ${r+1}</h4>
            <p><strong>Coordenadas:</strong> ${a.zone.lat.toFixed(4)}, ${a.zone.lng.toFixed(4)}</p>
            <p><strong>Puntuación:</strong> ${a.score}/100</p>
            <p><strong>Temperatura:</strong> ${a.zone.temp}°C</p>
            <p><strong>Vegetación actual:</strong> ${a.zone.vegetation}%</p>
            <p><strong>Densidad poblacional:</strong> ${a.zone.population}/km²</p>
            <p><strong>Especies recomendadas:</strong> ${this.getRecommendedSpecies(a.zone)}</p>
          </div>
        `).join("")}
      </div>

      <div class="report-section">
        <h3>Impacto Proyectado</h3>
        <p>La implementación de estas recomendaciones podría resultar en:</p>
        <ul>
          <li>Reducción de temperatura promedio: 2-4°C</li>
          <li>Mejora en calidad del aire: 15-25%</li>
          <li>Aumento de cobertura vegetal: 10-15%</li>
          <li>Beneficio para ${e.zones.reduce((a,r)=>a+r.population,0).toLocaleString()} habitantes</li>
        </ul>
      </div>
    `;document.getElementById("report-content").innerHTML=i,document.getElementById("report-modal").style.display="block"}clearMarkers(){this.markers.forEach(e=>{this.map.removeLayer(e)}),this.markers=[]}clearLayer(e){}getTemperatureColor(e){return e>30?"#dc3545":e>25?"#fd7e14":"#20c997"}getVegetationColor(e){return e>35?"#28a745":e>20?"#6f9654":"#8b4513"}getPopulationSize(e){return e>9e3?1200:e>7e3?900:600}getAirQualityColor(e){return e>85?"#dc3545":e>70?"#fd7e14":"#28a745"}}document.addEventListener("DOMContentLoaded",()=>{new s});
