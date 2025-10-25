/**
 * Export Handler for EPD Data
 * Manages data export functionality (JSON, CSV) and raw data viewing
 */

class ExportHandler {
    constructor() {
        this.exportJsonBtn = document.getElementById('exportJsonBtn');
        this.exportCsvBtn = document.getElementById('exportCsvBtn');
        this.toggleJsonBtn = document.getElementById('toggleJsonBtn');
        this.rawDataSection = document.getElementById('rawDataSection');
        this.rawDataContent = document.getElementById('rawDataContent');
        
        this.currentData = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.exportJsonBtn?.addEventListener('click', () => this.exportAsJSON());
        this.exportCsvBtn?.addEventListener('click', () => this.exportAsCSV());
        this.toggleJsonBtn?.addEventListener('click', () => this.toggleRawData());
    }

    setData(data) {
        this.currentData = data;
        this.updateRawDataDisplay(data);
    }

    exportAsJSON() {
        if (!this.currentData) {
            alert('No data available to export');
            return;
        }

        try {
            const jsonString = JSON.stringify(this.currentData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            
            const filename = this.generateFilename('json');
            this.downloadFile(blob, filename);
            
            this.showExportSuccess('JSON file downloaded successfully!');
        } catch (error) {
            console.error('JSON export error:', error);
            alert('Failed to export JSON data');
        }
    }

    exportAsCSV() {
        if (!this.currentData) {
            alert('No data available to export');
            return;
        }

        try {
            const csvContent = this.convertToCSV(this.currentData);
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            
            const filename = this.generateFilename('csv');
            this.downloadFile(blob, filename);
            
            this.showExportSuccess('CSV file downloaded successfully!');
        } catch (error) {
            console.error('CSV export error:', error);
            alert('Failed to export CSV data');
        }
    }

    convertToCSV(data) {
        const extractedData = data.data || data;
        const co2Data = data.carbonFootprintPerKg || {};
        
        // Define CSV headers and values
        const csvRows = [];
        csvRows.push(['Field', 'Value', 'Unit', 'Source']);
        
        // Add CO2 calculation
        if (co2Data.value) {
            csvRows.push(['CO2 Equivalent per kg', co2Data.value, 'kg CO₂e/kg', 'Calculated']);
        }
        
        // Add basic product information
        this.addCSVRow(csvRows, 'Product Name', extractedData.product_name || extractedData.productName || extractedData.material_name);
        this.addCSVRow(csvRows, 'Manufacturer', extractedData.manufacturer || extractedData.company || extractedData.producer);
        this.addCSVRow(csvRows, 'Product Type', extractedData.product_type || extractedData.productType || extractedData.category);
        this.addCSVRow(csvRows, 'Functional Unit', extractedData.functional_unit || extractedData.functionalUnit);
        this.addCSVRow(csvRows, 'EPD Number', extractedData.epd_number || extractedData.epdNumber || extractedData.declaration_number);
        this.addCSVRow(csvRows, 'Standard', extractedData.standard || extractedData.norm || extractedData.certification);
        this.addCSVRow(csvRows, 'Validity Period', extractedData.validity_period || extractedData.validity || extractedData.valid_until);
        
        // Add environmental impact data
        if (extractedData.gwp) {
            this.addCSVRow(csvRows, 'Global Warming Potential', extractedData.gwp.value, extractedData.gwp.unit || 'kg CO₂e', extractedData.gwp.source);
        }
        
        if (extractedData.material_density) {
            this.addCSVRow(csvRows, 'Material Density', extractedData.material_density.value, extractedData.material_density.unit || 'kg/m³', extractedData.material_density.source);
        }
        
        if (extractedData.material_weight) {
            this.addCSVRow(csvRows, 'Material Weight', extractedData.material_weight.value, extractedData.material_weight.unit || 'kg/m³', extractedData.material_weight.source);
        }
        
        // Add impact categories
        const impacts = extractedData.impact_categories || extractedData.impactCategories || extractedData.environmental_impacts;
        if (impacts) {
            this.addCSVRow(csvRows, 'Acidification Potential', impacts.acidification || impacts.ap || impacts.acidification_potential);
            this.addCSVRow(csvRows, 'Eutrophication Potential', impacts.eutrophication || impacts.ep || impacts.eutrophication_potential);
            this.addCSVRow(csvRows, 'Ozone Depletion Potential', impacts.ozone_depletion || impacts.odp || impacts.ozone_depletion_potential);
            this.addCSVRow(csvRows, 'Primary Energy Demand', impacts.primary_energy || impacts.pe || impacts.primary_energy_demand);
        }
        
        // Add system boundaries
        const boundaries = extractedData.system_boundaries || extractedData.systemBoundaries || extractedData.methodology;
        if (boundaries) {
            this.addCSVRow(csvRows, 'Lifecycle Phases', boundaries.lifecycle_phases || boundaries.phases || boundaries.life_cycle_stages);
            this.addCSVRow(csvRows, 'Assessment Method', boundaries.assessment_method || boundaries.method || boundaries.lca_method);
            this.addCSVRow(csvRows, 'Cut-off Rules', boundaries.cut_off_rules || boundaries.cutOff || boundaries.cutoff_criteria);
            this.addCSVRow(csvRows, 'Data Quality', boundaries.data_quality || boundaries.quality || boundaries.data_representativeness);
        }
        
        // Convert to CSV string
        return csvRows.map(row => 
            row.map(field => 
                typeof field === 'string' && field.includes(',') 
                    ? `"${field.replace(/"/g, '""')}"` 
                    : field || ''
            ).join(',')
        ).join('\n');
    }

    addCSVRow(csvRows, label, value, unit = '', source = '') {
        if (value !== undefined && value !== null && value !== '') {
            csvRows.push([label, value, unit, source]);
        }
    }

    toggleRawData() {
        if (this.rawDataSection.style.display === 'none') {
            this.rawDataSection.style.display = 'block';
            this.toggleJsonBtn.innerHTML = '<span class="export-icon">🔼</span>Hide Raw Data';
        } else {
            this.rawDataSection.style.display = 'none';
            this.toggleJsonBtn.innerHTML = '<span class="export-icon">🔍</span>View Raw Data';
        }
    }

    updateRawDataDisplay(data) {
        if (this.rawDataContent) {
            this.rawDataContent.textContent = JSON.stringify(data, null, 2);
        }
    }

    generateFilename(extension) {
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
        const productName = this.currentData?.data?.product_name || 
                           this.currentData?.data?.productName || 
                           this.currentData?.data?.material_name || 
                           'EPD-Data';
        
        const sanitizedName = productName.replace(/[^a-zA-Z0-9\-_]/g, '_');
        return `${sanitizedName}_${timestamp}.${extension}`;
    }

    downloadFile(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    showExportSuccess(message) {
        // Show a temporary success message
        const statusMessage = document.getElementById('statusMessage');
        if (statusMessage) {
            statusMessage.textContent = message;
            statusMessage.className = 'status-message success';
            statusMessage.style.display = 'block';
            
            // Hide after 3 seconds
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 3000);
        }
    }
}

// Export for use in other modules
window.ExportHandler = ExportHandler;