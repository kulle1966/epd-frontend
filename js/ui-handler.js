/**
 * UI Handler for EPD Extractor
 * Manages user interface interactions, drag & drop, file handling
 */

class UIHandler {
    constructor() {
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.browseBtn = document.getElementById('browseBtn');
        this.fileInfo = document.getElementById('fileInfo');
        this.fileName = document.getElementById('fileName');
        this.fileSize = document.getElementById('fileSize');
        this.removeBtn = document.getElementById('removeBtn');
        this.extractBtn = document.getElementById('extractBtn');
        this.progressBar = document.getElementById('progressBar');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.statusMessage = document.getElementById('statusMessage');
        this.resultsSection = document.getElementById('resultsSection');
        this.resultsGrid = document.getElementById('resultsGrid');
        
        this.currentFile = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // File input events
        this.browseBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e.target.files[0]));
        
        // Drag and drop events
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        
        // Remove file button
        this.removeBtn.addEventListener('click', () => this.removeFile());
        
        // Extract button
        this.extractBtn.addEventListener('click', () => this.startExtraction());
    }

    handleFileSelect(file) {
        if (!file) return;
        
        if (file.type !== 'application/pdf') {
            this.showStatus('Please select a PDF file.', 'error');
            return;
        }

        if (file.size > 50 * 1024 * 1024) { // 50MB limit
            this.showStatus('File size too large. Please select a PDF file smaller than 50MB.', 'error');
            return;
        }

        this.currentFile = file;
        this.displayFileInfo(file);
        this.extractBtn.disabled = false;
        this.hideStatus();
    }

    displayFileInfo(file) {
        this.fileName.textContent = file.name;
        this.fileSize.textContent = this.formatFileSize(file.size);
        this.fileInfo.style.display = 'flex';
        this.uploadArea.style.display = 'none';
    }

    removeFile() {
        this.currentFile = null;
        this.fileInfo.style.display = 'none';
        this.uploadArea.style.display = 'block';
        this.extractBtn.disabled = true;
        this.fileInput.value = '';
        this.hideResults();
        this.hideStatus();
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.handleFileSelect(files[0]);
        }
    }

    startExtraction() {
        if (!this.currentFile) return;
        
        // Trigger extraction via app controller
        if (window.app && window.app.epdProcessor) {
            window.app.epdProcessor.processEPD(this.currentFile);
        }
    }

    showProgress(percentage = 0, text = 'Processing...') {
        this.progressBar.style.display = 'block';
        this.progressFill.style.width = `${percentage}%`;
        this.progressText.textContent = text;
        this.extractBtn.disabled = true;
    }

    hideProgress() {
        this.progressBar.style.display = 'none';
        this.extractBtn.disabled = false;
    }

    showStatus(message, type = 'info') {
        this.statusMessage.textContent = message;
        this.statusMessage.className = `status-message ${type}`;
        this.statusMessage.style.display = 'block';
    }

    hideStatus() {
        this.statusMessage.style.display = 'none';
    }

    showResults(data) {
        this.populateResultsGrid(data);
        this.resultsSection.style.display = 'block';
        
        // Scroll to results
        this.resultsSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    hideResults() {
        this.resultsSection.style.display = 'none';
    }

    populateResultsGrid(data) {
        // Clear existing results
        this.resultsGrid.innerHTML = '';

        // Update CO2 value
        this.updateCO2Display(data);

        // Create result cards for each data point
        const extractedData = data.data || data;
        const resultItems = this.createResultItems(extractedData, data);

        resultItems.forEach(item => {
            const card = this.createResultCard(item);
            this.resultsGrid.appendChild(card);
        });
    }

    updateCO2Display(data) {
        const co2ValueElement = document.getElementById('co2Value');
        const calculationElement = document.getElementById('calculationFormula');
        
        const co2 = data.carbonFootprintPerKg;
        if (co2 && co2.value !== "Not calculable") {
            co2ValueElement.innerHTML = `${parseFloat(co2.value).toFixed(4)} <small>kg CO₂e/kg</small>`;
            
            const extractedData = data.data || data;
            const gwp = extractedData.gwp?.value || 'X';
            const density = extractedData.material_density?.value || 'Y';
            calculationElement.textContent = `${gwp} kg CO₂e/m³ ÷ ${density} kg/m³ = ${co2.value} kg CO₂e/kg`;
        } else {
            co2ValueElement.textContent = 'Not calculable';
            calculationElement.textContent = co2?.reason || 'Insufficient data available';
        }
    }

    createResultItems(extractedData, fullData) {
        return [
            { title: 'Product Name', value: extractedData.product_name || extractedData.productName || extractedData.material_name || fullData.materialName || 'Not found' },
            { title: 'Manufacturer', value: extractedData.manufacturer || extractedData.company || extractedData.producer || 'Not found' },
            { title: 'Product Type', value: extractedData.product_type || extractedData.productType || extractedData.category || 'Not found' },
            { title: 'Functional Unit', value: extractedData.functional_unit || extractedData.functionalUnit || fullData.functionalUnit || 'Not found' },
            { title: 'EPD Number', value: extractedData.epd_number || extractedData.epdNumber || extractedData.declaration_number || 'Not found' },
            { title: 'Standard/Norm', value: extractedData.standard || extractedData.norm || extractedData.certification || 'Not found' },
            { title: 'Validity Period', value: extractedData.validity_period || extractedData.validity || extractedData.valid_until || 'Not found' },
            { 
                title: 'Global Warming Potential', 
                value: this.formatGWPValue(extractedData.gwp, fullData.gwp),
                source: extractedData.gwp?.source || 'Source not specified'
            },
            { 
                title: 'Material Density', 
                value: this.formatDensityValue(extractedData.material_density, fullData.materialDensity),
                source: extractedData.material_density?.source || 'Source not specified'
            },
            { 
                title: 'Material Weight', 
                value: this.formatWeightValue(extractedData.material_weight, fullData.materialWeight),
                source: extractedData.material_weight?.source || 'Source not specified'
            },
            { title: 'Acidification Potential', value: this.getImpactValue(extractedData, 'acidification', 'ap', 'acidification_potential') },
            { title: 'Eutrophication Potential', value: this.getImpactValue(extractedData, 'eutrophication', 'ep', 'eutrophication_potential') },
            { title: 'Ozone Depletion Potential', value: this.getImpactValue(extractedData, 'ozone_depletion', 'odp', 'ozone_depletion_potential') },
            { title: 'Primary Energy Demand', value: this.getImpactValue(extractedData, 'primary_energy', 'pe', 'primary_energy_demand') },
            { title: 'Lifecycle Phases', value: this.getSystemBoundaryValue(extractedData, 'lifecycle_phases', 'phases', 'life_cycle_stages') || 'A1-A3 (Cradle to Gate)' },
            { title: 'Assessment Method', value: this.getSystemBoundaryValue(extractedData, 'assessment_method', 'method', 'lca_method') || 'EN 15804+A2' }
        ].filter(item => item.value && item.value !== 'Not found');
    }

    formatGWPValue(gwpData, fallback) {
        if (gwpData?.value) {
            const unit = gwpData.unit || 'kg CO₂e';
            return `${gwpData.value} ${unit}`;
        }
        return fallback || 'Not available';
    }

    formatDensityValue(densityData, fallback) {
        if (densityData?.value) {
            const unit = densityData.unit || 'kg/m³';
            return `${densityData.value} ${unit}`;
        }
        return fallback ? `${fallback} kg/m³` : 'Not available';
    }

    formatWeightValue(weightData, fallback) {
        if (weightData?.value) {
            const unit = weightData.unit || 'kg/m³';
            return `${weightData.value} ${unit}`;
        }
        return fallback ? `${fallback} kg/m³` : 'Not available';
    }

    getImpactValue(data, ...keys) {
        const impacts = data.impact_categories || data.impactCategories || data.environmental_impacts;
        if (!impacts) return 'Not available';
        
        for (const key of keys) {
            if (impacts[key]) return impacts[key];
        }
        return 'Not available';
    }

    getSystemBoundaryValue(data, ...keys) {
        const boundaries = data.system_boundaries || data.systemBoundaries || data.methodology;
        if (!boundaries) return null;
        
        for (const key of keys) {
            if (boundaries[key]) return boundaries[key];
        }
        return null;
    }

    createResultCard(item) {
        const card = document.createElement('div');
        card.className = 'result-card';
        
        card.innerHTML = `
            <h4>${item.title}</h4>
            <div class="value">${item.value}</div>
            ${item.source ? `<div class="source">${item.source}</div>` : ''}
        `;
        
        return card;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Export for use in other modules
window.UIHandler = UIHandler;