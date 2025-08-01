const { createApp } = Vue;

// API base URL
const API_BASE = '/api';

createApp({
    data() {
        return {
            // Member form
            memberForm: {
                name: '',
                age: '',
                contact: '',
                ministry_group: ''
            },
            
            // Data
            members: [],
            ministries: [],
            filteredMembers: [],
            
            // Search and filter
            searchQuery: '',
            selectedMinistry: '',
            
            // UI state
            loading: false,
            error: '',
            successMessage: ''
        };
    },
    
    async mounted() {
        await this.loadMinistries();
        await this.loadMembers();
    },
    
    methods: {
        // Data loading methods
        async loadMembers() {
            try {
                const response = await axios.get(`${API_BASE}/members`);
                this.members = response.data;
                this.filteredMembers = [...this.members];
            } catch (error) {
                this.error = 'Failed to load members';
                console.error('Error loading members:', error);
            }
        },
        
        async loadMinistries() {
            try {
                //const response = await axios.get(`${API_BASE}/ministries`);

                //this.ministries = response.data;
                this.ministries = [
                    'SMF', 'OCCM', 'English bible study', 'Sunday School', 'cooking',
                    'cleaning', 'Choir', 'IT'
                ];
            } catch (error) {
                console.error('Error loading ministries:', error);
            }
        },
        
        // Member management methods
        async addMember() {
            this.loading = true;
            this.error = '';
            this.successMessage = '';
            
            try {
                const response = await axios.post(`${API_BASE}/members`, this.memberForm);
                
                if (response.data.success) {
                    this.successMessage = 'Member added successfully!';
                    this.memberForm = {
                        name: '',
                        age: '',
                        contact: '',
                        ministry_group: ''
                    };
                    await this.loadMembers();
                    await this.loadMinistries(); // Refresh ministries in case new one was added
                    
                    // Clear success message after 3 seconds
                    setTimeout(() => {
                        this.successMessage = '';
                    }, 3000);
                }
            } catch (error) {
                this.error = error.response?.data?.error || 'Failed to add member';
            } finally {
                this.loading = false;
            }
        },
        
        async deleteMember(memberName) {
            if (!confirm('Are you sure you want to delete this member?')) {
                return;
            }
            
            try {
                await axios.delete(`${API_BASE}/members/${encodeURIComponent(memberName)}`);
                await this.loadMembers();
                this.successMessage = 'Member deleted successfully!';
                
                // Clear success message after 3 seconds
                setTimeout(() => {
                    this.successMessage = '';
                }, 3000);
            } catch (error) {
                this.error = 'Failed to delete member';
                console.error('Error deleting member:', error);
            }
        },
        
        // Search and filter methods
        async searchMembers() {
            if (!this.searchQuery.trim()) {
                this.filteredMembers = [...this.members];
                return;
            }
            
            try {
                const response = await axios.get(`${API_BASE}/members/search`, {
                    params: { q: this.searchQuery }
                });
                this.filteredMembers = response.data;
            } catch (error) {
                console.error('Error searching members:', error);
                this.error = 'Search failed';
            }
        },
        
        async filterByMinistry() {
            if (!this.selectedMinistry) {
                this.filteredMembers = [...this.members];
                return;
            }
            
            try {
                const response = await axios.get(`${API_BASE}/members/ministry/${this.selectedMinistry}`);
                this.filteredMembers = response.data;
            } catch (error) {
                console.error('Error filtering by ministry:', error);
                this.error = 'Filter failed';
            }
        },
        
        // Utility methods
        clearMessages() {
            this.error = '';
            this.successMessage = '';
        }
    },
    
    watch: {
        // Clear messages when forms change
        memberForm: {
            handler() {
                this.clearMessages();
            },
            deep: true
        },
        
        // Reset search when ministry filter changes
        selectedMinistry() {
            this.searchQuery = '';
        },
        
        // Reset ministry filter when search query changes
        searchQuery() {
            if (this.searchQuery.trim()) {
                this.selectedMinistry = '';
            }
        }
    }
}).mount('#app');
