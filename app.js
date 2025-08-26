// Heap Data Structure Implementation
class MinHeap {
    constructor() {
        this.heap = [];
    }

    getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }

    getLeftChildIndex(index) {
        return 2 * index + 1;
    }

    getRightChildIndex(index) {
        return 2 * index + 2;
    }

    swap(index1, index2) {
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }

    insert(student) {
        this.heap.push(student);
        this.heapifyUp(this.heap.length - 1);
    }

    heapifyUp(index) {
        if (index === 0) return;
        
        const parentIndex = this.getParentIndex(index);
        if (this.heap[parentIndex].priorityScore > this.heap[index].priorityScore) {
            this.swap(parentIndex, index);
            this.heapifyUp(parentIndex);
        }
    }

    extractMin() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);
        return min;
    }

    heapifyDown(index) {
        const leftChildIndex = this.getLeftChildIndex(index);
        const rightChildIndex = this.getRightChildIndex(index);
        let smallestIndex = index;

        if (leftChildIndex < this.heap.length && 
            this.heap[leftChildIndex].priorityScore < this.heap[smallestIndex].priorityScore) {
            smallestIndex = leftChildIndex;
        }

        if (rightChildIndex < this.heap.length && 
            this.heap[rightChildIndex].priorityScore < this.heap[smallestIndex].priorityScore) {
            smallestIndex = rightChildIndex;
        }

        if (smallestIndex !== index) {
            this.swap(index, smallestIndex);
            this.heapifyDown(smallestIndex);
        }
    }

    peek() {
        return this.heap.length > 0 ? this.heap[0] : null;
    }

    size() {
        return this.heap.length;
    }

    toArray() {
        return [...this.heap];
    }

    clear() {
        this.heap = [];
    }
}

// Application State Management
class HostelAllotmentSystem {
    constructor() {
        this.studentHeap = new MinHeap();
        this.rooms = [];
        this.allocations = [];
        this.specialPriorityMultipliers = {
            "None": 1.0,
            "Medical": 0.5,
            "Sports": 0.7,
            "Academic Excellence": 0.6,
            "Financial Aid": 0.8
        };
        
        this.initializeData();
        this.initializeUI();
    }

    initializeData() {
        // Sample rooms data
        this.rooms = [
            {"id": "A101", "type": "Single", "capacity": 1, "occupied": 0, "features": ["AC", "WiFi", "Study Table", "Attached Bathroom"], "floor": 1, "building": "A"},
            {"id": "A102", "type": "Double", "capacity": 2, "occupied": 0, "features": ["AC", "WiFi", "Study Table"], "floor": 1, "building": "A"},
            {"id": "A103", "type": "Triple", "capacity": 3, "occupied": 1, "features": ["WiFi", "Study Table"], "floor": 1, "building": "A"},
            {"id": "A201", "type": "Single", "capacity": 1, "occupied": 1, "features": ["AC", "WiFi", "Attached Bathroom"], "floor": 2, "building": "A"},
            {"id": "A202", "type": "Double", "capacity": 2, "occupied": 0, "features": ["AC", "WiFi", "Study Table", "Attached Bathroom"], "floor": 2, "building": "A"},
            {"id": "B101", "type": "Double", "capacity": 2, "occupied": 1, "features": ["WiFi", "Study Table"], "floor": 1, "building": "B"},
            {"id": "B102", "type": "Triple", "capacity": 3, "occupied": 0, "features": ["AC", "WiFi"], "floor": 1, "building": "B"},
            {"id": "B201", "type": "Single", "capacity": 1, "occupied": 0, "features": ["AC", "Study Table", "Attached Bathroom"], "floor": 2, "building": "B"},
            {"id": "B202", "type": "Double", "capacity": 2, "occupied": 2, "features": ["WiFi", "Study Table"], "floor": 2, "building": "B"},
            {"id": "C101", "type": "Triple", "capacity": 3, "occupied": 0, "features": ["AC", "WiFi", "Study Table"], "floor": 1, "building": "C"},
            {"id": "C102", "type": "Single", "capacity": 1, "occupied": 0, "features": ["WiFi", "Attached Bathroom"], "floor": 1, "building": "C"},
            {"id": "C201", "type": "Double", "capacity": 2, "occupied": 0, "features": ["AC", "WiFi", "Study Table", "Attached Bathroom"], "floor": 2, "building": "C"},
            {"id": "C202", "type": "Triple", "capacity": 3, "occupied": 2, "features": ["WiFi", "Study Table"], "floor": 2, "building": "C"},
            {"id": "D101", "type": "Single", "capacity": 1, "occupied": 0, "features": ["AC", "WiFi"], "floor": 1, "building": "D"},
            {"id": "D102", "type": "Double", "capacity": 2, "occupied": 1, "features": ["AC", "Study Table", "Attached Bathroom"], "floor": 1, "building": "D"},
            {"id": "D201", "type": "Triple", "capacity": 3, "occupied": 0, "features": ["WiFi", "Study Table"], "floor": 2, "building": "D"},
            {"id": "D202", "type": "Single", "capacity": 1, "occupied": 0, "features": ["AC", "WiFi", "Study Table", "Attached Bathroom"], "floor": 2, "building": "D"},
            {"id": "E101", "type": "Double", "capacity": 2, "occupied": 0, "features": ["AC", "WiFi", "Study Table"], "floor": 1, "building": "E"},
            {"id": "E102", "type": "Triple", "capacity": 3, "occupied": 1, "features": ["WiFi", "Study Table", "Attached Bathroom"], "floor": 1, "building": "E"},
            {"id": "E201", "type": "Single", "capacity": 1, "occupied": 0, "features": ["AC", "WiFi", "Attached Bathroom"], "floor": 2, "building": "E"}
        ];

        // Sample applications
        const sampleApplications = [
            {"name": "John Smith", "studentId": "CS2021001", "gpa": 3.8, "specialPriority": "Academic Excellence", "preferences": ["A101", "B201", "D202"], "timestamp": 1640995200000},
            {"name": "Sarah Johnson", "studentId": "CS2021002", "gpa": 3.2, "specialPriority": "Medical", "preferences": ["A202", "C201", "E101"], "timestamp": 1640995500000},
            {"name": "Mike Chen", "studentId": "CS2021003", "gpa": 3.6, "specialPriority": "Sports", "preferences": ["B102", "C101", "D201"], "timestamp": 1640995800000},
            {"name": "Emily Davis", "studentId": "CS2021004", "gpa": 3.9, "specialPriority": "None", "preferences": ["A101", "B201", "C102"], "timestamp": 1640996100000},
            {"name": "Alex Wong", "studentId": "CS2021005", "gpa": 2.8, "specialPriority": "Financial Aid", "preferences": ["A103", "B101", "C202"], "timestamp": 1640996400000},
            {"name": "Jessica Brown", "studentId": "CS2021006", "gpa": 3.4, "specialPriority": "None", "preferences": ["D102", "E102", "A202"], "timestamp": 1640996700000},
            {"name": "David Wilson", "studentId": "CS2021007", "gpa": 3.7, "specialPriority": "Academic Excellence", "preferences": ["E201", "D202", "B201"], "timestamp": 1640997000000}
        ];

        // Add sample applications to heap
        sampleApplications.forEach(app => {
            const student = this.createStudentFromApplication(app);
            this.studentHeap.insert(student);
        });
    }

    initializeUI() {
        // Setup tab navigation first
        this.setupTabNavigation();
        
        // Then initialize other UI components
        this.populateRoomSelectors();
        this.renderRoomGrid();
        this.renderApplicationsList();
        this.renderRoomMatrix();
        this.updateHeapVisualization();
        this.setupEventListeners();
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = btn.getAttribute('data-tab');
                console.log('Tab clicked:', targetTab); // Debug log
                
                // Update active tab button
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update active tab content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    console.log('Checking content:', content.id, 'against:', `${targetTab}-tab`); // Debug log
                });
                
                // Show the target tab
                const targetContent = document.getElementById(`${targetTab}-tab`);
                if (targetContent) {
                    targetContent.classList.add('active');
                    console.log('Activated tab:', `${targetTab}-tab`); // Debug log
                } else {
                    console.error('Target tab content not found:', `${targetTab}-tab`);
                }
            });
        });
    }

    setupEventListeners() {
        // Student form submission
        const studentForm = document.getElementById('student-form');
        if (studentForm) {
            studentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleStudentFormSubmission();
            });
        }

        // Allocation button
        const allocateBtn = document.getElementById('allocate-btn');
        if (allocateBtn) {
            allocateBtn.addEventListener('click', () => {
                this.runAllocationAlgorithm();
            });
        }

        // Clear allocations button
        const clearBtn = document.getElementById('clear-allocations');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearAllocations();
            });
        }

        // Modal close
        const closeModalBtn = document.getElementById('close-modal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                const modal = document.getElementById('success-modal');
                if (modal) {
                    modal.classList.add('hidden');
                }
            });
        }
    }

    calculatePriorityScore(gpa, specialPriority, timestamp) {
        const basePriority = 1000;
        const specialMultiplier = this.specialPriorityMultipliers[specialPriority];
        const gpaBonus = gpa * 100;
        const timestampBonus = Math.max(0, (Date.now() - timestamp) / (1000 * 60 * 60)); // Hours since submission
        
        return (basePriority * specialMultiplier) - gpaBonus - timestampBonus;
    }

    createStudentFromApplication(application) {
        const priorityScore = this.calculatePriorityScore(
            application.gpa,
            application.specialPriority,
            application.timestamp
        );

        return {
            ...application,
            priorityScore: Math.round(priorityScore * 100) / 100,
            allocated: false,
            allocatedRoom: null
        };
    }

    handleStudentFormSubmission() {
        const nameInput = document.getElementById('student-name');
        const idInput = document.getElementById('student-id');
        const gpaInput = document.getElementById('gpa');
        const priorityInput = document.getElementById('special-priority');
        const pref1Input = document.getElementById('pref-1');
        const pref2Input = document.getElementById('pref-2');
        const pref3Input = document.getElementById('pref-3');

        if (!nameInput || !idInput || !gpaInput || !priorityInput) {
            console.error('Required form inputs not found');
            return;
        }

        const formData = {
            name: nameInput.value,
            studentId: idInput.value,
            gpa: parseFloat(gpaInput.value),
            specialPriority: priorityInput.value,
            preferences: [
                pref1Input ? pref1Input.value : '',
                pref2Input ? pref2Input.value : '',
                pref3Input ? pref3Input.value : ''
            ].filter(pref => pref !== ''),
            timestamp: Date.now()
        };

        if (!formData.name || !formData.studentId || !formData.gpa) {
            alert('Please fill in all required fields');
            return;
        }

        const student = this.createStudentFromApplication(formData);
        this.studentHeap.insert(student);

        // Update UI
        this.renderApplicationsList();
        this.updateHeapVisualization();
        
        // Show success modal
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
        
        // Reset form
        const form = document.getElementById('student-form');
        if (form) {
            form.reset();
        }
    }

    populateRoomSelectors() {
        const availableRooms = this.rooms.filter(room => room.occupied < room.capacity);
        const selectors = document.querySelectorAll('.room-select');
        
        console.log('Found selectors:', selectors.length); // Debug log
        console.log('Available rooms:', availableRooms.length); // Debug log
        
        selectors.forEach(select => {
            select.innerHTML = '<option value="">Select a room</option>';
            availableRooms.forEach(room => {
                const option = document.createElement('option');
                option.value = room.id;
                option.textContent = `${room.id} - ${room.type} (${room.capacity - room.occupied} spots available)`;
                select.appendChild(option);
            });
        });
    }

    renderRoomGrid() {
        const roomGrid = document.getElementById('room-grid');
        if (!roomGrid) return;
        
        roomGrid.innerHTML = '';

        this.rooms.forEach(room => {
            const roomCard = document.createElement('div');
            let statusClass = 'available';
            if (room.occupied === room.capacity) {
                statusClass = 'full';
            } else if (room.occupied > 0) {
                statusClass = 'partial';
            }
            
            roomCard.className = `room-card ${statusClass}`;
            roomCard.innerHTML = `
                <div class="room-header">
                    <span class="room-id">${room.id}</span>
                    <span class="room-type">${room.type}</span>
                </div>
                <div class="room-occupancy">
                    Occupancy: ${room.occupied}/${room.capacity}
                </div>
                <div class="room-features">
                    ${room.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
            `;
            
            roomGrid.appendChild(roomCard);
        });
    }

    renderApplicationsList() {
        const applicationsList = document.getElementById('applications-list');
        if (!applicationsList) return;
        
        applicationsList.innerHTML = '';

        const applications = this.studentHeap.toArray().sort((a, b) => a.priorityScore - b.priorityScore);
        
        applications.forEach((student, index) => {
            const applicationItem = document.createElement('div');
            applicationItem.className = 'application-item';
            applicationItem.innerHTML = `
                <div class="student-info">
                    <div class="student-name">${student.name}</div>
                    <div class="student-id">${student.studentId}</div>
                </div>
                <div class="gpa-info">
                    <div class="gpa-value">${student.gpa}</div>
                    <div>GPA</div>
                </div>
                <div class="priority-info">
                    <div class="priority-score">${student.priorityScore}</div>
                    <div>${student.specialPriority}</div>
                </div>
                <div class="preferences">
                    ${student.preferences.map((pref, i) => `<span class="pref-tag">${i + 1}. ${pref}</span>`).join('')}
                </div>
                <div class="status--info">Rank: ${index + 1}</div>
            `;
            applicationsList.appendChild(applicationItem);
        });
    }

    renderRoomMatrix() {
        const roomMatrix = document.getElementById('room-matrix');
        if (!roomMatrix) return;
        
        roomMatrix.innerHTML = '';

        this.rooms.forEach(room => {
            const matrixRoom = document.createElement('div');
            let statusClass = 'available';
            if (room.occupied === room.capacity) {
                statusClass = 'full';
            } else if (room.occupied > 0) {
                statusClass = 'partial';
            }
            
            // Check if room is allocated in current allocation results
            const allocation = this.allocations.find(alloc => alloc.roomId === room.id);
            if (allocation) {
                statusClass = 'allocated';
            }
            
            matrixRoom.className = `matrix-room ${statusClass}`;
            matrixRoom.innerHTML = `
                <div><strong>${room.id}</strong></div>
                <div>${room.occupied}/${room.capacity}</div>
            `;
            roomMatrix.appendChild(matrixRoom);
        });
    }

    updateHeapVisualization() {
        const heapContainer = document.getElementById('heap-container');
        const heapSizeElement = document.getElementById('heap-size');
        
        if (heapSizeElement) {
            heapSizeElement.textContent = this.studentHeap.size();
        }
        
        if (!heapContainer) return;
        
        heapContainer.innerHTML = '';

        const heap = this.studentHeap.toArray();
        heap.forEach((student, index) => {
            const heapNode = document.createElement('div');
            heapNode.className = `heap-node ${index === 0 ? 'root' : ''}`;
            heapNode.innerHTML = `
                <div style="font-size: 10px;">${student.name.split(' ')[0]}</div>
                <div style="font-size: 8px;">${student.priorityScore}</div>
            `;
            heapNode.title = `${student.name} - Priority: ${student.priorityScore}`;
            heapContainer.appendChild(heapNode);
        });
    }

    async runAllocationAlgorithm() {
        if (this.studentHeap.size() === 0) {
            alert('No applications to process!');
            return;
        }

        // Show progress
        const progressSection = document.getElementById('allocation-progress');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        if (progressSection) {
            progressSection.style.display = 'block';
        }
        this.allocations = [];

        const totalStudents = this.studentHeap.size();
        let processedStudents = 0;

        // Process each student from heap
        while (this.studentHeap.size() > 0) {
            const student = this.studentHeap.extractMin();
            let allocated = false;
            let allocatedRoom = null;

            // Try to allocate based on preferences
            for (const roomId of student.preferences) {
                const room = this.rooms.find(r => r.id === roomId);
                if (room && room.occupied < room.capacity) {
                    room.occupied++;
                    allocated = true;
                    allocatedRoom = roomId;
                    break;
                }
            }

            // If no preference available, try any available room
            if (!allocated) {
                const availableRoom = this.rooms.find(room => room.occupied < room.capacity);
                if (availableRoom) {
                    availableRoom.occupied++;
                    allocated = true;
                    allocatedRoom = availableRoom.id;
                }
            }

            this.allocations.push({
                student: student,
                allocated: allocated,
                roomId: allocatedRoom,
                preferenceMatch: student.preferences.indexOf(allocatedRoom) + 1 || 0
            });

            processedStudents++;
            const progress = (processedStudents / totalStudents) * 100;
            
            if (progressFill) {
                progressFill.style.width = `${progress}%`;
            }
            
            if (progressText) {
                progressText.textContent = `Processing ${student.name}...`;
            }

            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        if (progressText) {
            progressText.textContent = 'Allocation completed!';
        }
        
        setTimeout(() => {
            if (progressSection) {
                progressSection.style.display = 'none';
            }
        }, 1000);

        this.renderAllocationResults();
        this.renderRoomMatrix();
        this.updateHeapVisualization();
    }

    renderAllocationResults() {
        // Render summary statistics
        const totalAllocated = this.allocations.filter(alloc => alloc.allocated).length;
        const totalWaitlisted = this.allocations.length - totalAllocated;
        const preferenceMatches = this.allocations.filter(alloc => alloc.preferenceMatch > 0).length;

        const summaryElement = document.getElementById('results-summary');
        if (summaryElement) {
            summaryElement.innerHTML = `
                <div class="result-stat">
                    <span class="stat-value">${totalAllocated}</span>
                    <span class="stat-label">Students Allocated</span>
                </div>
                <div class="result-stat">
                    <span class="stat-value">${totalWaitlisted}</span>
                    <span class="stat-label">Students Waitlisted</span>
                </div>
                <div class="result-stat">
                    <span class="stat-value">${preferenceMatches}</span>
                    <span class="stat-label">Preference Matches</span>
                </div>
                <div class="result-stat">
                    <span class="stat-value">${Math.round((totalAllocated / this.allocations.length) * 100)}%</span>
                    <span class="stat-label">Success Rate</span>
                </div>
            `;
        }

        // Render allocation list
        const allocationList = document.getElementById('allocation-list');
        if (!allocationList) return;
        
        allocationList.innerHTML = '';

        this.allocations.forEach(allocation => {
            const allocationItem = document.createElement('div');
            allocationItem.className = `allocation-item ${allocation.allocated ? 'success' : 'waitlist'}`;
            
            const resultText = allocation.allocated 
                ? `Room ${allocation.roomId}${allocation.preferenceMatch > 0 ? ` (${allocation.preferenceMatch}${allocation.preferenceMatch === 1 ? 'st' : allocation.preferenceMatch === 2 ? 'nd' : 'rd'} choice)` : ' (Auto-assigned)'}`
                : 'Waitlisted';
                
            allocationItem.innerHTML = `
                <div class="student-info">
                    <div class="student-name">${allocation.student.name}</div>
                    <div class="student-id">${allocation.student.studentId}</div>
                </div>
                <div class="priority-info">
                    <div class="priority-score">${allocation.student.priorityScore}</div>
                    <div>${allocation.student.specialPriority}</div>
                </div>
                <div class="gpa-info">
                    <div class="gpa-value">${allocation.student.gpa}</div>
                    <div>GPA</div>
                </div>
                <div class="allocation-result ${allocation.allocated ? 'allocated' : 'waitlisted'}">
                    ${resultText}
                </div>
            `;
            allocationList.appendChild(allocationItem);
        });
    }

    clearAllocations() {
        // Reset room occupancy to original state
        this.rooms.forEach(room => {
            if (room.id === "A103") room.occupied = 1;
            else if (room.id === "A201") room.occupied = 1;
            else if (room.id === "B101") room.occupied = 1;
            else if (room.id === "B202") room.occupied = 2;
            else if (room.id === "C202") room.occupied = 2;
            else if (room.id === "D102") room.occupied = 1;
            else if (room.id === "E102") room.occupied = 1;
            else room.occupied = 0;
        });

        // Re-add all allocated students back to heap
        this.allocations.forEach(allocation => {
            this.studentHeap.insert(allocation.student);
        });

        this.allocations = [];
        
        // Update UI
        this.renderRoomMatrix();
        this.renderApplicationsList();
        this.updateHeapVisualization();
        this.populateRoomSelectors();
        
        // Clear results
        const summaryElement = document.getElementById('results-summary');
        const allocationListElement = document.getElementById('allocation-list');
        
        if (summaryElement) summaryElement.innerHTML = '';
        if (allocationListElement) allocationListElement.innerHTML = '';
    }
}

// Initialize the system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing system...');
    new HostelAllotmentSystem();
});