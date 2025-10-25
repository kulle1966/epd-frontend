/**
 * EPD Processor for Azure API Integration
 * Handles communication with the Azure Functions EPD extraction API
 */

class EPDProcessor {
    constructor() {
        this.apiBaseUrl = 'https://epd-extractor-api-2025.azurewebsites.net';
        this.uiHandler = null;
    }

    setUIHandler(uiHandler) {
        this.uiHandler = uiHandler;
    }

    async processEPD(file) {
        if (!file) {
            this.showError('No file selected');
            return;
        }

        try {
            // Show initial progress
            this.showProgress(10, 'Uploading PDF...');
            
            // Create form data
            const formData = new FormData();
            formData.append('pdf', file);

            // Show upload progress
            this.showProgress(30, 'Processing with Azure OpenAI...');

            // Make API request
            const response = await fetch(`${this.apiBaseUrl}/api/extract-epd`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            // Show processing progress
            this.showProgress(70, 'Extracting EPD data...');

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            // Show completion progress
            this.showProgress(100, 'Processing complete!');
            
            // Small delay to show completion
            setTimeout(() => {
                this.hideProgress();
                this.showResults(data);
                this.showSuccess('EPD data extracted successfully!');
            }, 500);

        } catch (error) {
            console.error('EPD processing error:', error);
            this.hideProgress();
            this.showError(`Processing failed: ${error.message}`);
        }
    }

    async checkAPIHealth() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/health`);
            if (response.ok) {
                const healthData = await response.json();
                console.log('✅ API is healthy and ready');
                
                // Update API version display
                const apiVersion = healthData.version || 'Unknown';
                const versionElement = document.getElementById('apiVersion');
                if (versionElement) {
                    versionElement.textContent = `v${apiVersion}`;
                }
                
                return true;
            } else {
                console.warn('⚠️ API might have issues');
                this.updateAPIStatus('Error');
                return false;
            }
        } catch (error) {
            console.error('❌ API is not reachable:', error);
            this.updateAPIStatus('Offline');
            return false;
        }
    }

    updateAPIStatus(status) {
        const versionElement = document.getElementById('apiVersion');
        if (versionElement) {
            versionElement.textContent = status;
        }
    }

    showProgress(percentage, text) {
        if (this.uiHandler) {
            this.uiHandler.showProgress(percentage, text);
        }
    }

    hideProgress() {
        if (this.uiHandler) {
            this.uiHandler.hideProgress();
        }
    }

    showResults(data) {
        if (this.uiHandler) {
            this.uiHandler.showResults(data);
        }
        
        // Store data for export functionality
        window.currentEPDData = data;
    }

    showError(message) {
        if (this.uiHandler) {
            this.uiHandler.showStatus(message, 'error');
        }
    }

    showSuccess(message) {
        if (this.uiHandler) {
            this.uiHandler.showStatus(message, 'success');
        }
    }

    showInfo(message) {
        if (this.uiHandler) {
            this.uiHandler.showStatus(message, 'info');
        }
    }
}

// Export for use in other modules
window.EPDProcessor = EPDProcessor;