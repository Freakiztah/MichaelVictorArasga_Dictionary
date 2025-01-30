document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchTerm = document.getElementById('searchTerm');
    const definitionContainer = document.getElementById('definition');

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent form from submitting normally
        const term = searchTerm.value.trim();
        if (term) {
            fetchDefinition(term);
        } else {
            definitionContainer.textContent = 'Please enter a term to search.';
        }
    });

    async function fetchDefinition(term) {
        const apiKey = 'e7c19dcb-0ab1-4962-8b1b-d1d92cd5f816'; // 🔑 Place your actual API key here
        const apiUrl = `https://dictionaryapi.com/api/v3/references/thesaurus/json/${encodeURIComponent(term)}?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            displayDefinition(data, term);
        } catch (error) {
            console.error('Error fetching the definition:', error);
            definitionContainer.textContent = 'An error occurred while fetching the definition.';
        }
    }

    function displayDefinition(data, term) {
        // Clear any previous content
        definitionContainer.innerHTML = '';

        if (Array.isArray(data) && data.length > 0) {
            // Check if the first entry has a short definition
            if (data[0].shortdef && data[0].shortdef.length > 0) {
                const definition = data[0].shortdef[0];
                const partOfSpeech = data[0].fl ? ` (${data[0].fl})` : '';

                definitionContainer.innerHTML = `
                    <h2>${term.charAt(0).toUpperCase() + term.slice(1)}${partOfSpeech}</h2>
                    <p>${definition}</p>
                `;
            } else if (typeof data[0] === 'string') {
                // Suggestions if no exact match is found
                definitionContainer.innerHTML = `
                    <p>No exact match found for "${term}". Did you mean:</p>
                    <ul>
                        ${data.slice(0, 5).map(suggestion => `<li>${suggestion}</li>`).join('')}
                    </ul>
                `;
            } else {
                definitionContainer.textContent = 'No definition found.';
            }
        } else {
            definitionContainer.textContent = 'No definition found.';
        }
    }
});
