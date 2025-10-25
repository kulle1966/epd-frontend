/**
 * Main Application Controller
 * Coordinates all components of the EPD Extractor application
 */

class EPDExtractorApp {
    constructor() {
        this.uiHandler = null;
        this.epdProcessor = null;
        this.exportHandler = null;
        
        this.initialize();
    }

    async initialize() {
        console.log('🚀 Initializing Matelio GreenComplay EPD Extractor v2.0.0');
        
        // Initialize components
        this.uiHandler = new UIHandler();
        this.epdProcessor = new EPDProcessor();
        this.exportHandler = new ExportHandler();
        
        // Set up component relationships
        this.epdProcessor.setUIHandler(this.uiHandler);
        
        // Override EPD processor's showResults to also update export handler
        const originalShowResults = this.epdProcessor.showResults.bind(this.epdProcessor);
        this.epdProcessor.showResults = (data) => {
            originalShowResults(data);
            this.exportHandler.setData(data);
        };
        
        // Check API health on startup
        await this.epdProcessor.checkAPIHealth();
        
        // Set up global error handling
        this.setupErrorHandling();
        
        console.log('✅ Application initialized successfully');
        
        // Show welcome message
        this.showWelcomeMessage();
    }

    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.uiHandler.showStatus('An unexpected error occurred. Please try again.', 'error');
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.uiHandler.showStatus('A processing error occurred. Please try again.', 'error');
        });
    }

    showWelcomeMessage() {
        // Show a brief welcome message
        this.uiHandler.showStatus(
            'Welcome to Matelio GreenComplay EPD Extractor! Upload a PDF to get started.', 
            'info'
        );
        
        // Hide the message after 5 seconds
        setTimeout(() => {
            this.uiHandler.hideStatus();
        }, 5000);
    }

    // Method to manually trigger API health check
    async refreshAPIStatus() {
        const isHealthy = await this.epdProcessor.checkAPIHealth();
        
        if (isHealthy) {
            this.uiHandler.showStatus('API connection verified successfully!', 'success');
        } else {
            this.uiHandler.showStatus('API connection failed. Some features may not work.', 'error');
        }
        
        setTimeout(() => {
            this.uiHandler.hideStatus();
        }, 3000);
    }

    // Method to get current application state
    getAppState() {
        return {
            hasFile: !!this.uiHandler.currentFile,
            fileName: this.uiHandler.currentFile?.name,
            fileSize: this.uiHandler.currentFile?.size,
            hasResults: !!window.currentEPDData,
            apiConnected: document.getElementById('apiVersion')?.textContent !== 'Offline'
        };
    }

    // Method for debugging and development
    debug() {
        console.log('🔍 EPD Extractor Debug Info:');
        console.log('App State:', this.getAppState());
        console.log('Current File:', this.uiHandler.currentFile);
        console.log('Current Data:', window.currentEPDData);
        console.log('UI Handler:', this.uiHandler);
        console.log('EPD Processor:', this.epdProcessor);
        console.log('Export Handler:', this.exportHandler);
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new EPDExtractorApp();
});

// Add some helper functions to global scope for debugging
window.refreshAPI = () => window.app?.refreshAPIStatus();
window.debugApp = () => window.app?.debug();

// Console welcome message
console.log(`
🌱 Matelio GreenComplay EPD Extractor v2.0.0
==============================================
Debug commands:
- debugApp(): Show application state
- refreshAPI(): Check API connection
- window.app: Access main application instance
==============================================
`);

// Export for potential external use
window.EPDExtractorApp = EPDExtractorApp;