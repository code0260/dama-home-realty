<x-filament-widgets::widget>
    <x-filament::section>
        <x-slot name="heading">
            {{ $this->getHeading() }}
        </x-slot>

        <div class="w-full">
            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4" style="height: 400px;">
                <div class="h-full flex flex-col">
                    <!-- Chat Messages Area -->
                    <div id="ai-chat-messages" class="flex-1 overflow-y-auto mb-4 space-y-3">
                        <div class="flex items-start gap-3">
                            <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                                AI
                            </div>
                            <div class="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                                <p class="text-sm text-gray-900 dark:text-white">
                                    {{ $this->getViewData()['initial_message'] }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Chat Input -->
                    <div class="flex gap-2">
                        <input
                            type="text"
                            id="ai-chat-input"
                            placeholder="Ask DamaGenie anything about your dashboard..."
                            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                        <button
                            id="ai-chat-send"
                            class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                DamaGenie can help you analyze data, generate reports, and answer questions about your dashboard.
            </p>
        </div>

        <script>
            document.addEventListener('DOMContentLoaded', function() {
                const input = document.getElementById('ai-chat-input');
                const sendBtn = document.getElementById('ai-chat-send');
                const messagesDiv = document.getElementById('ai-chat-messages');
                const apiEndpoint = '{{ $this->getViewData()["api_endpoint"] }}';

                function addMessage(message, isUser = false) {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'flex items-start gap-3';
                    
                    if (isUser) {
                        messageDiv.innerHTML = `
                            <div class="flex-1 bg-primary/10 rounded-lg p-3 ml-auto max-w-[80%]">
                                <p class="text-sm text-gray-900 dark:text-white">${message}</p>
                            </div>
                            <div class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-white font-bold">
                                U
                            </div>
                        `;
                    } else {
                        messageDiv.innerHTML = `
                            <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                                AI
                            </div>
                            <div class="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                                <p class="text-sm text-gray-900 dark:text-white">${message}</p>
                            </div>
                        `;
                    }
                    
                    messagesDiv.appendChild(messageDiv);
                    messagesDiv.scrollTop = messagesDiv.scrollHeight;
                }

                function sendMessage() {
                    const message = input.value.trim();
                    if (!message) return;

                    addMessage(message, true);
                    input.value = '';

                    // Show loading
                    addMessage('Thinking...', false);

                    // Send to API
                    fetch(apiEndpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                            'Accept': 'application/json',
                        },
                        credentials: 'same-origin',
                        body: JSON.stringify({
                            message: message,
                            context: 'admin_dashboard',
                        }),
                    })
                    .then(response => response.json())
                    .then(data => {
                        // Remove loading message
                        messagesDiv.removeChild(messagesDiv.lastChild);
                        
                        if (data.message) {
                            addMessage(data.message, false);
                        } else {
                            addMessage('Sorry, I encountered an error. Please try again.', false);
                        }
                    })
                    .catch(error => {
                        messagesDiv.removeChild(messagesDiv.lastChild);
                        addMessage('Sorry, I encountered an error. Please try again.', false);
                        console.error('AI Chat Error:', error);
                    });
                }

                sendBtn.addEventListener('click', sendMessage);
                input.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        sendMessage();
                    }
                });
            });
        </script>
    </x-filament::section>
</x-filament-widgets::widget>

