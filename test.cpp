
#include <iostream>
#include <vector>
#include <queue>
#include <string>
#include <map>
#include <algorithm>
#include <iomanip>
#include <ctime>
#include <memory>

using namespace std;

// Room class to represent hostel rooms
class Room {
public:
    string roomId;
    string type;          // Single, Double, Triple
    int capacity;
    int currentOccupancy;
    vector<string> features;
    int floor;
    string building;
    bool isAvailable;

    Room(string id, string roomType, int cap, int occ, vector<string> feat, int fl, string bld) 
        : roomId(id), type(roomType), capacity(cap), currentOccupancy(occ), 
          features(feat), floor(fl), building(bld) {
        isAvailable = (currentOccupancy < capacity);
    }

    bool hasSpace() const {
        return currentOccupancy < capacity;
    }

    void allocateSpace() {
        if (hasSpace()) {
            currentOccupancy++;
            isAvailable = (currentOccupancy < capacity);
        }
    }

    void displayRoom() const {
        cout << "Room " << roomId << " (" << type << ") - " 
             << currentOccupancy << "/" << capacity << " occupied";
        cout << " [Features: ";
        for (size_t i = 0; i < features.size(); ++i) {
            cout << features[i];
            if (i < features.size() - 1) cout << ", ";
        }
        cout << "]" << endl;
    }
};

// Student class to represent student applications
class Student {
public:
    string name;
    string studentId;
    double gpa;
    string specialPriority;
    vector<string> preferences;
    double priorityScore;
    long timestamp;
    string allocatedRoom;
    bool isAllocated;

    Student(string n, string id, double g, string sp, vector<string> pref) 
        : name(n), studentId(id), gpa(g), specialPriority(sp), preferences(pref), 
          allocatedRoom(""), isAllocated(false) {
        timestamp = time(nullptr) + rand() % 3600; // Simulate different submission times
        calculatePriorityScore();
    }

private:
    void calculatePriorityScore() {
        // Priority score formula: (base_priority * special_multiplier) - (GPA * 100) - (timestamp_bonus)
        // Lower score = higher priority (min-heap)

        double specialMultiplier = getSpecialPriorityMultiplier();
        double basePriority = 1000.0;
        double gpaBonus = gpa * 100.0;
        double timestampBonus = (timestamp % 3600) * 0.01; // Small time-based bonus

        priorityScore = (basePriority * specialMultiplier) - gpaBonus - timestampBonus;
    }

    double getSpecialPriorityMultiplier() {
        if (specialPriority == "Medical") return 0.5;
        if (specialPriority == "Sports") return 0.7;
        if (specialPriority == "Academic") return 0.6;
        if (specialPriority == "Financial") return 0.8;
        return 1.0; // None
    }

public:
    void displayStudent() const {
        cout << "Student: " << name << " (ID: " << studentId << ")" << endl;
        cout << "  GPA: " << fixed << setprecision(2) << gpa << endl;
        cout << "  Special Priority: " << specialPriority << endl;
        cout << "  Priority Score: " << fixed << setprecision(2) << priorityScore << endl;
        cout << "  Preferences: ";
        for (size_t i = 0; i < preferences.size(); ++i) {
            cout << preferences[i];
            if (i < preferences.size() - 1) cout << " > ";
        }
        cout << endl;
        if (isAllocated) {
            cout << "  ✓ Allocated to Room: " << allocatedRoom << endl;
        } else {
            cout << "  ✗ Not allocated" << endl;
        }
        cout << endl;
    }
};

// Comparator for min-heap (priority queue)
struct StudentComparator {
    bool operator()(const shared_ptr<Student>& a, const shared_ptr<Student>& b) {
        // Min-heap: return true if a has lower priority than b
        if (abs(a->priorityScore - b->priorityScore) < 0.001) {
            // If priority scores are equal, use timestamp (earlier submission has priority)
            return a->timestamp > b->timestamp;
        }
        return a->priorityScore > b->priorityScore;
    }
};

// Hostel Management System
class HostelAllocationSystem {
private:
    map<string, shared_ptr<Room>> rooms;
    priority_queue<shared_ptr<Student>, vector<shared_ptr<Student>>, StudentComparator> studentHeap;
    vector<shared_ptr<Student>> allStudents;
    vector<shared_ptr<Student>> allocatedStudents;
    vector<shared_ptr<Student>> waitlistStudents;

public:
    HostelAllocationSystem() {
        initializeRooms();
        initializeSampleStudents();
    }

private:
    void initializeRooms() {
        // Initialize sample rooms
        vector<shared_ptr<Room>> roomList = {
            make_shared<Room>("A101", "Single", 1, 0, vector<string>{"AC", "WiFi", "Study Table"}, 1, "A"),
            make_shared<Room>("A102", "Double", 2, 0, vector<string>{"AC", "WiFi"}, 1, "A"),
            make_shared<Room>("A103", "Triple", 3, 1, vector<string>{"WiFi", "Study Table"}, 1, "A"),
            make_shared<Room>("A201", "Single", 1, 1, vector<string>{"AC", "Attached Bathroom"}, 2, "A"),
            make_shared<Room>("A202", "Double", 2, 0, vector<string>{"AC", "WiFi", "Study Table"}, 2, "A"),
            make_shared<Room>("B101", "Double", 2, 1, vector<string>{"WiFi", "Study Table"}, 1, "B"),
            make_shared<Room>("B102", "Triple", 3, 0, vector<string>{"AC", "WiFi"}, 1, "B"),
            make_shared<Room>("B201", "Single", 1, 0, vector<string>{"AC", "Study Table"}, 2, "B"),
            make_shared<Room>("B202", "Double", 2, 2, vector<string>{"WiFi"}, 2, "B"),
            make_shared<Room>("C101", "Triple", 3, 0, vector<string>{"AC", "WiFi", "Study Table"}, 1, "C"),
            make_shared<Room>("C102", "Single", 1, 0, vector<string>{"WiFi", "Attached Bathroom"}, 1, "C"),
            make_shared<Room>("C201", "Double", 2, 0, vector<string>{"AC", "WiFi", "Attached Bathroom"}, 2, "C"),
            make_shared<Room>("D101", "Single", 1, 0, vector<string>{"AC", "WiFi"}, 1, "D"),
            make_shared<Room>("D102", "Double", 2, 1, vector<string>{"AC", "Attached Bathroom"}, 1, "D"),
            make_shared<Room>("E101", "Double", 2, 0, vector<string>{"AC", "WiFi", "Study Table"}, 1, "E")
        };

        for (auto room : roomList) {
            rooms[room->roomId] = room;
        }
    }

    void initializeSampleStudents() {
        vector<shared_ptr<Student>> students = {
            make_shared<Student>("John Smith", "CS2021001", 3.8, "Academic", vector<string>{"A101", "B201", "D101"}),
            make_shared<Student>("Sarah Johnson", "CS2021002", 3.2, "Medical", vector<string>{"A202", "C201", "E101"}),
            make_shared<Student>("Mike Chen", "CS2021003", 3.6, "Sports", vector<string>{"B102", "C101", "B101"}),
            make_shared<Student>("Emily Davis", "CS2021004", 3.9, "None", vector<string>{"A101", "B201", "C102"}),
            make_shared<Student>("Alex Wong", "CS2021005", 2.8, "Financial", vector<string>{"A103", "B101", "C201"}),
            make_shared<Student>("Jessica Brown", "CS2021006", 3.4, "None", vector<string>{"D102", "A202", "E101"}),
            make_shared<Student>("David Wilson", "CS2021007", 3.7, "Academic", vector<string>{"C102", "D101", "B201"}),
            make_shared<Student>("Lisa Wang", "CS2021008", 3.1, "Sports", vector<string>{"C101", "B102", "A202"}),
            make_shared<Student>("Tom Brown", "CS2021009", 3.5, "None", vector<string>{"E101", "C201", "A202"}),
            make_shared<Student>("Amy Lee", "CS2021010", 3.3, "Medical", vector<string>{"A101", "C102", "D101"})
        };

        for (auto student : students) {
            allStudents.push_back(student);
            studentHeap.push(student);
        }
    }

public:
    void displayRoomAvailability() {
        cout << "\n" << string(60, '=') << endl;
        cout << "            ROOM AVAILABILITY STATUS" << endl;
        cout << string(60, '=') << endl;

        for (auto& pair : rooms) {
            auto room = pair.second;
            cout << "Room " << room->roomId << " (" << setw(6) << room->type << ") - ";
            cout << room->currentOccupancy << "/" << room->capacity << " occupied";

            if (room->hasSpace()) {
                cout << " [AVAILABLE]";
            } else {
                cout << " [FULL]     ";
            }

            cout << " - Features: ";
            for (size_t i = 0; i < room->features.size(); ++i) {
                cout << room->features[i];
                if (i < room->features.size() - 1) cout << ", ";
            }
            cout << endl;
        }
        cout << endl;
    }

    void displayStudentApplications() {
        cout << string(60, '=') << endl;
        cout << "          STUDENT APPLICATIONS (Priority Order)" << endl;
        cout << string(60, '=') << endl;

        // Create a copy of the heap to display without modifying original
        auto tempHeap = studentHeap;
        int rank = 1;

        while (!tempHeap.empty()) {
            auto student = tempHeap.top();
            tempHeap.pop();

            cout << "Rank " << rank++ << ": " << student->name 
                 << " (Priority Score: " << fixed << setprecision(2) 
                 << student->priorityScore << ")" << endl;
            cout << "         ID: " << student->studentId 
                 << " | GPA: " << student->gpa 
                 << " | Special: " << student->specialPriority << endl;
            cout << "         Preferences: ";
            for (size_t i = 0; i < student->preferences.size(); ++i) {
                cout << student->preferences[i];
                if (i < student->preferences.size() - 1) cout << " > ";
            }
            cout << endl << endl;
        }
    }

    void runAllocationAlgorithm() {
        cout << string(60, '=') << endl;
        cout << "           STARTING ROOM ALLOCATION" << endl;
        cout << string(60, '=') << endl;

        allocatedStudents.clear();
        waitlistStudents.clear();

        while (!studentHeap.empty()) {
            auto student = studentHeap.top();
            studentHeap.pop();

            cout << "\nProcessing: " << student->name << " (Priority: " 
                 << fixed << setprecision(2) << student->priorityScore << ")" << endl;

            bool allocated = false;

            // Try to allocate based on preferences
            for (const string& roomId : student->preferences) {
                if (rooms.find(roomId) != rooms.end() && rooms[roomId]->hasSpace()) {
                    // Allocate the room
                    rooms[roomId]->allocateSpace();
                    student->allocatedRoom = roomId;
                    student->isAllocated = true;
                    allocatedStudents.push_back(student);
                    allocated = true;

                    cout << "  ✓ Allocated to preferred room: " << roomId << endl;
                    break;
                }
            }

            // If no preferred room available, try any available room
            if (!allocated) {
                for (auto& pair : rooms) {
                    if (pair.second->hasSpace()) {
                        pair.second->allocateSpace();
                        student->allocatedRoom = pair.first;
                        student->isAllocated = true;
                        allocatedStudents.push_back(student);
                        allocated = true;

                        cout << "  ⚠ Allocated to alternative room: " << pair.first << endl;
                        break;
                    }
                }
            }

            // If still not allocated, add to waitlist
            if (!allocated) {
                waitlistStudents.push_back(student);
                cout << "  ✗ Added to waitlist (no rooms available)" << endl;
            }
        }

        cout << "\n" << string(60, '=') << endl;
        cout << "           ALLOCATION COMPLETED" << endl;
        cout << string(60, '=') << endl;
    }

    void displayResults() {
        cout << "\n" << string(60, '=') << endl;
        cout << "              ALLOCATION RESULTS" << endl;
        cout << string(60, '=') << endl;

        cout << "\nSUCCESSFULLY ALLOCATED STUDENTS (" << allocatedStudents.size() << "):" << endl;
        cout << string(40, '-') << endl;
        for (auto student : allocatedStudents) {
            cout << student->name << " → Room " << student->allocatedRoom << endl;
        }

        if (!waitlistStudents.empty()) {
            cout << "\nWAITLIST (" << waitlistStudents.size() << "):" << endl;
            cout << string(40, '-') << endl;
            for (auto student : waitlistStudents) {
                cout << student->name << " (Priority: " 
                     << fixed << setprecision(2) << student->priorityScore << ")" << endl;
            }
        }

        // Statistics
        cout << "\n" << string(60, '=') << endl;
        cout << "                 STATISTICS" << endl;
        cout << string(60, '=') << endl;

        int totalStudents = allStudents.size();
        int totalAllocated = allocatedStudents.size();
        int totalWaitlist = waitlistStudents.size();

        cout << "Total Applications: " << totalStudents << endl;
        cout << "Successfully Allocated: " << totalAllocated << endl;
        cout << "Waitlisted: " << totalWaitlist << endl;
        cout << "Allocation Success Rate: " << fixed << setprecision(1) 
             << (100.0 * totalAllocated / totalStudents) << "%" << endl;

        // Room utilization
        int totalCapacity = 0, totalOccupied = 0;
        for (auto& pair : rooms) {
            totalCapacity += pair.second->capacity;
            totalOccupied += pair.second->currentOccupancy;
        }

        cout << "Room Utilization: " << totalOccupied << "/" << totalCapacity 
             << " (" << fixed << setprecision(1) << (100.0 * totalOccupied / totalCapacity) 
             << "%)" << endl;
    }

    void addNewStudent() {
        string name, studentId, specialPriority;
        double gpa;
        vector<string> preferences;

        cout << "\n" << string(50, '=') << endl;
        cout << "         ADD NEW STUDENT APPLICATION" << endl;
        cout << string(50, '=') << endl;

        cout << "Enter student name: ";
        cin.ignore();
        getline(cin, name);

        cout << "Enter student ID: ";
        getline(cin, studentId);

        cout << "Enter GPA (0.0-4.0): ";
        cin >> gpa;

        cout << "\nSpecial Priority Options:" << endl;
        cout << "1. None" << endl;
        cout << "2. Medical" << endl;
        cout << "3. Sports" << endl;
        cout << "4. Academic" << endl;
        cout << "5. Financial" << endl;
        cout << "Choose (1-5): ";

        int choice;
        cin >> choice;
        switch (choice) {
            case 2: specialPriority = "Medical"; break;
            case 3: specialPriority = "Sports"; break;
            case 4: specialPriority = "Academic"; break;
            case 5: specialPriority = "Financial"; break;
            default: specialPriority = "None"; break;
        }

        cout << "\nSelect up to 3 room preferences:" << endl;
        displayAvailableRoomsForSelection();

        cout << "Enter room IDs (press enter after each, 'done' to finish): ";
        string roomId;
        while (preferences.size() < 3) {
            cin >> roomId;
            if (roomId == "done") break;
            if (rooms.find(roomId) != rooms.end()) {
                preferences.push_back(roomId);
            } else {
                cout << "Invalid room ID. Try again: ";
            }
        }

        auto newStudent = make_shared<Student>(name, studentId, gpa, specialPriority, preferences);
        allStudents.push_back(newStudent);
        studentHeap.push(newStudent);

        cout << "\nStudent added successfully!" << endl;
        cout << "Priority Score: " << fixed << setprecision(2) << newStudent->priorityScore << endl;
    }

    void displayAvailableRoomsForSelection() {
        cout << "Available Rooms:" << endl;
        for (auto& pair : rooms) {
            if (pair.second->hasSpace()) {
                cout << "  " << pair.first << " (" << pair.second->type << ")";
                if (pair.second->features.size() > 0) {
                    cout << " - " << pair.second->features[0];
                    if (pair.second->features.size() > 1) cout << "...";
                }
                cout << endl;
            }
        }
    }

    void displayMenu() {
        cout << "\n" << string(60, '=') << endl;
        cout << "        HOSTEL ROOM ALLOCATION SYSTEM" << endl;
        cout << "          (Heap-based Priority Queue)" << endl;
        cout << string(60, '=') << endl;
        cout << "1. Display Room Availability" << endl;
        cout << "2. Display Student Applications (Priority Order)" << endl;
        cout << "3. Run Allocation Algorithm" << endl;
        cout << "4. Display Results" << endl;
        cout << "5. Add New Student Application" << endl;
        cout << "6. Exit" << endl;
        cout << string(60, '=') << endl;
        cout << "Select option: ";
    }

    void run() {
        int choice;
        bool allocated = false;

        while (true) {
            displayMenu();
            cin >> choice;

            switch (choice) {
                case 1:
                    displayRoomAvailability();
                    break;
                case 2:
                    displayStudentApplications();
                    break;
                case 3:
                    runAllocationAlgorithm();
                    allocated = true;
                    break;
                case 4:
                    if (allocated) {
                        displayResults();
                    } else {
                        cout << "\nPlease run allocation algorithm first!" << endl;
                    }
                    break;
                case 5:
                    addNewStudent();
                    break;
                case 6:
                    cout << "\nThank you for using the Hostel Allocation System!" << endl;
                    return;
                default:
                    cout << "\nInvalid choice. Please try again." << endl;
            }

            cout << "\nPress Enter to continue...";
            cin.ignore();
            cin.get();
        }
    }
};

// Heap demonstration functions
void demonstrateHeapOperations() {
    cout << "\n" << string(60, '=') << endl;
    cout << "           HEAP DATA STRUCTURE DEMO" << endl;
    cout << string(60, '=') << endl;

    priority_queue<shared_ptr<Student>, vector<shared_ptr<Student>>, StudentComparator> demoHeap;

    // Create sample students for demonstration
    vector<shared_ptr<Student>> demoStudents = {
        make_shared<Student>("Alice", "001", 3.5, "None", vector<string>{"A101"}),
        make_shared<Student>("Bob", "002", 3.8, "Academic", vector<string>{"A102"}),
        make_shared<Student>("Charlie", "003", 2.9, "Medical", vector<string>{"A103"}),
        make_shared<Student>("Diana", "004", 3.2, "Sports", vector<string>{"A104"})
    };

    cout << "\nInserting students into min-heap:" << endl;
    for (auto student : demoStudents) {
        demoHeap.push(student);
        cout << "Inserted: " << student->name << " (Priority Score: " 
             << fixed << setprecision(2) << student->priorityScore << ")" << endl;
    }

    cout << "\nExtracting students from heap (highest priority first):" << endl;
    while (!demoHeap.empty()) {
        auto student = demoHeap.top();
        demoHeap.pop();
        cout << "Extracted: " << student->name << " (Priority Score: " 
             << fixed << setprecision(2) << student->priorityScore << ")" << endl;
    }
}

int main() {
    srand(time(nullptr)); // For random timestamp generation

    cout << "Welcome to the Hostel Room Allocation System!" << endl;
    cout << "This system uses a min-heap priority queue for efficient allocation." << endl;

    // Demonstrate heap operations first
    demonstrateHeapOperations();

    cout << "\nPress Enter to start the main system...";
    cin.get();

    // Run the main hostel allocation system
    HostelAllocationSystem system;
    system.run();

    return 0;
}
