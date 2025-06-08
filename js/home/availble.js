class PlaystationAvailability {
    constructor(showActions = false) {
        this.showActions = showActions;
        this.playstations = [
            { id: 1, name: 'Playstation 4', status: 'available', endTime: null, jam: null },
            { id: 2, name: 'Playstation 4', status: 'available', endTime: null, jam: null },
            { id: 3, name: 'Playstation 4', status: 'available', endTime: null, jam: null },
            { id: 4, name: 'Playstation 4', status: 'available', endTime: null, jam: null },
            { id: 5, name: 'Playstation 4', status: 'available', endTime: null, jam: null },
            { id: 6, name: 'Playstation 4', status: 'available', endTime: null, jam: null },
            { id: 7, name: 'Playstation 4', status: 'available', endTime: null, jam: null },
            { id: 8, name: 'Playstation 4', status: 'available', endTime: null, jam: null },
            { id: 9, name: 'Playstation 4', status: 'available', endTime: null, jam: null },
            { id: 10, name: 'Playstation 5', status: 'available', endTime: null, jam: null },
            { id: 11, name: 'Playstation 5', status: 'available', endTime: null, jam: null },
            { id: 12, name: 'Playstation 5', status: 'available', endTime: null, jam: null },
            { id: 13, name: 'Playstation 5', status: 'available', endTime: null, jam: null },
            { id: 14, name: 'Playstation 5', status: 'available', endTime: null, jam: null }
        ];
        this.eventsBound = false;
        this.init();
        this.startAutoRefresh();
    }

    init() {
        this.renderAvailability();
        if (!this.eventsBound) {
            this.bindEvents();
            this.eventsBound = true;
        }
    }

    renderAvailability() {
        const container = document.querySelector('#availability .row');
        if (!container) return;

        container.innerHTML = '';

        this.playstations.forEach(ps => {
            const card = this.createCard(ps);
            container.appendChild(card);
        });
    }

    createCard(ps) {
        const col = document.createElement('div');
        col.className = 'col-sm-4 col-md-4';

        const isAvailable = ps.status === 'available';
        const icon = isAvailable ? 'fa-check' : 'fa-ban';
        const timeDisplay = isAvailable ? 
            '<h6 style="margin-bottom: 42px"></h6>' : 
            `<h6>Selesai pukul ${ps.endTime}</h6>`;

        col.innerHTML = `
            <div class="card" data-ps-id="${ps.id}">
                <span class="fa fa-4x ${icon}"></span>
                ${timeDisplay}
                <div class="card-body">
                    <h5 class="card-title">${ps.name}</h5>
                    ${this.showActions ? `
                        <div class="card-actions" style="margin-top: 10px;">
                            ${this.getActionButtons(ps)}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        return col;
    }

    getActionButtons(ps) {
        if (!this.showActions) return '';
        
        if (ps.status === 'available') {
            return `
                <button class="btn btn-success btn-sm start-session" data-ps-id="${ps.id}">
                    <i class="fa fa-play"></i> Mulai Sesi
                </button>
            `;
        } else {
            return `
                <button class="btn btn-warning btn-sm extend-session" data-ps-id="${ps.id}">
                    <i class="fa fa-clock-o"></i> Perpanjang
                </button>
                <button class="btn btn-danger btn-sm end-session" data-ps-id="${ps.id}">
                    <i class="fa fa-stop"></i> Selesai
                </button>
            `;
        }
    }

    bindEvents() {
        const self = this;
        
        this.clickHandler = function(e) {
            if (e.target.closest('.start-session')) {
                const button = e.target.closest('.start-session');
                const psId = parseInt(button.dataset.psId);
                
                // Tambahkan check untuk mencegah double click
                if (button.disabled) {
                    return;
                }
                
                // Temporary disable button untuk mencegah double click
                button.disabled = true;
                
                // Panggil startSession
                self.startSession(psId);
                
                // Re-enable button setelah delay singkat
                setTimeout(() => {
                    button.disabled = false;
                }, 1000);
            }
            
            if (e.target.closest('.end-session')) {
                const button = e.target.closest('.end-session');
                const psId = parseInt(button.dataset.psId);
                
                // Tambahkan check untuk mencegah double click
                if (button.disabled) {
                    return;
                }
                
                // Temporary disable button untuk mencegah double click
                button.disabled = true;
                
                self.endSession(psId);
                
                // Re-enable button setelah delay singkat
                setTimeout(() => {
                    button.disabled = false;
                }, 1000);
            }
            
            if (e.target.closest('.extend-session')) {
                const button = e.target.closest('.extend-session');
                const psId = parseInt(button.dataset.psId);
                
                // Tambahkan check untuk mencegah double click
                if (button.disabled) {
                    return;
                }
                
                // Temporary disable button untuk mencegah double click
                button.disabled = true;
                
                self.extendSession(psId);
                
                // Re-enable button setelah delay singkat
                setTimeout(() => {
                    button.disabled = false;
                }, 1000);
            }
        };
        
        document.removeEventListener('click', this.clickHandler);
        document.addEventListener('click', this.clickHandler);
    }

    startSession(psId) {
        const duration = prompt('Berapa jam sesi gaming? (contoh: 2)', '1');
        
        if (!duration || isNaN(duration)) {
            return;
        }
        
        const ps = this.playstations.find(p => p.id === psId);
        if (!ps) {
            return;
        }

        const now = new Date();
        const endTime = new Date(now.getTime() + (parseFloat(duration) * 60 * 60 * 1000));
        
        ps.jam = duration;
        ps.status = 'busy';
        ps.endTime = endTime.toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
        }).replace('.', ':');

        this.renderAvailability();
        this.showNotification(`${ps.name} dimulai untuk ${duration} jam. Selesai pada ${ps.endTime}`, 'success');
        this.saveToStorage();
    }

    endSession(psId) {
        const confirmResult = confirm('Yakin ingin mengakhiri sesi ini?');
        
        if (!confirmResult) {
            return;
        }

        const ps = this.playstations.find(p => p.id === psId);
        if (!ps) {
            return;
        }
        
        ps.jam = null;
        ps.status = 'available';
        ps.endTime = null;

        this.renderAvailability();
        this.showNotification(`${ps.name} sekarang tersedia`, 'success');
        this.saveToStorage();
    }

    extendSession(psId) {
        const additionalTime = prompt('Perpanjang berapa jam? (contoh: 1)', '1');
        
        if (!additionalTime || isNaN(additionalTime)) {
            return;
        }

        const ps = this.playstations.find(p => p.id === psId);
        if (!ps) {
            return;
        }

        if (!ps.endTime) {
            this.showNotification('Error: Tidak ada waktu berakhir untuk PlayStation ini', 'error');
            return;
        }

        try {
            const timeRegex = /^(\d{1,2})[:.](\d{2})$/;
            const match = ps.endTime.match(timeRegex);
            
            if (!match) {
                this.showNotification('Error: Format waktu tidak valid', 'error');
                return;
            }

            const hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);
            
            const currentEndTime = new Date();
            currentEndTime.setHours(hours, minutes, 0, 0);
            
            const now = new Date();
            if (currentEndTime < now) {
                currentEndTime.setDate(currentEndTime.getDate() + 1);
            }
            
            const newEndTime = new Date(currentEndTime.getTime() + (parseFloat(additionalTime) * 60 * 60 * 1000));
            const formattedNewEndTime = newEndTime.toLocaleTimeString('id-ID', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false
            }).replace('.', ':');
            
            ps.endTime = formattedNewEndTime;

            this.renderAvailability();
            this.showNotification(`${ps.name} diperpanjang ${additionalTime} jam. Selesai pada ${ps.endTime}`, 'info');
            this.saveToStorage();
            
        } catch (error) {
            this.showNotification('Error: Gagal memperpanjang sesi', 'error');
        }
    }

    checkExpiredSessions() {
        const now = new Date();
        let hasChanges = false;

        this.playstations.forEach(ps => {
            if (ps.status === 'busy' && ps.endTime) {
                try {
                    const timeRegex = /^(\d{1,2})[:.](\d{2})$/;
                    const match = ps.endTime.match(timeRegex);
                    
                    if (!match) return;

                    const hours = parseInt(match[1], 10);
                    const minutes = parseInt(match[2], 10);
                    
                    const endTime = new Date();
                    endTime.setHours(hours, minutes, 0, 0);
                    
                    if (endTime < now && (now.getTime() - endTime.getTime()) > 12 * 60 * 60 * 1000) {
                        endTime.setDate(endTime.getDate() + 1);
                    }

                    if (now >= endTime) {
                        ps.status = 'available';
                        ps.endTime = null;
                        ps.jam = null;
                        hasChanges = true;
                        this.showNotification(`${ps.name} sesi telah berakhir dan sekarang tersedia`, 'info');
                    }
                } catch (error) {

                }
            }
        });

        if (hasChanges) {
            this.renderAvailability();
            this.saveToStorage();
        }
    }

    startAutoRefresh() {
        setInterval(() => {
            this.checkExpiredSessions();
        }, 60000);
    }

    showNotification(message, type = 'info') {
        const existing = document.querySelector('.notification-popup');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show notification-popup`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 300px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        `;
        
        notification.innerHTML = `
            ${message}
            <button type="button" class="close" data-dismiss="alert">
                <span>&times;</span>
            </button>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    saveToStorage() {
        try {
            const dataToSave = JSON.stringify(this.playstations);
            localStorage.setItem('psAvailability', dataToSave);
        } catch (error) {

        }
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('psAvailability');
            if (saved) {
                this.playstations = JSON.parse(saved);
                
                this.playstations.forEach(ps => {
                    if (ps.endTime) {
                        ps.endTime = this.normalizeTimeFormat(ps.endTime);
                    }
                });
            }
        } catch (error) {

        }
    }

    normalizeTimeFormat(timeString) {
        if (!timeString) return null;
        return timeString.replace('.', ':');
    }

    getStats() {
        const available = this.playstations.filter(ps => ps.status === 'available').length;
        const busy = this.playstations.filter(ps => ps.status === 'busy').length;
        
        return {
            total: this.playstations.length,
            available,
            busy,
            availabilityRate: ((available / this.playstations.length) * 100).toFixed(1)
        };
    }

    resetAllSessions() {
        if (!confirm('Yakin ingin mereset semua sesi? Semua PlayStation akan menjadi tersedia.')) return;
        
        this.playstations.forEach(ps => {
            ps.status = 'available';
            ps.endTime = null;
            ps.jam = null;
        });
        
        this.renderAvailability();
        this.saveToStorage();
        this.showNotification('Semua sesi telah direset', 'warning');
    }
}

let globalAvailability = null;

document.addEventListener('DOMContentLoaded', function() {
    if (globalAvailability) return;
    
    const isAdminPage = window.location.pathname.includes('admin.html');
    globalAvailability = new PlaystationAvailability(isAdminPage); 
    
    globalAvailability.loadFromStorage();
    globalAvailability.renderAvailability();
    
    if (window.location.hash === '#admin' || isAdminPage) {
        addAdminPanel(globalAvailability);
    }
});

function addAdminPanel(availability) {
    if (document.querySelector('.admin-panel')) return;
    
    const adminPanel = document.createElement('div');
    adminPanel.className = 'admin-panel';
    adminPanel.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: #8B0000;
        padding: 15px;
        border-radius: 5px;
        color: white;
        z-index: 9999;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    `;
    
    adminPanel.innerHTML = `
        <h5>Admin Panel</h5>
        <button class="btn btn-warning btn-sm" onclick="globalAvailability.resetAllSessions()">
            Reset All Sessions
        </button>
        <div style="margin-top: 10px; font-size: 12px;">
            <div>Total: ${availability.getStats().total}</div>
            <div>Available: ${availability.getStats().available}</div>
            <div>Busy: ${availability.getStats().busy}</div>
        </div>
    `;
    
    document.body.appendChild(adminPanel);
}