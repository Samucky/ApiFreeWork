// Token de autenticación
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJTb3kgZ2F5IiwiaWF0IjoxNzI4OTI4NDg1LCJleHAiOjE3Mjg5MzIwODV9.UfWybnRXpoUgpc42J-Lqs-2chio8Ex1Kubt5DKGUzcY';

// URL de la API
const apiUrl = 'https://pruebaapi-g7s1.onrender.com/api/freelancer/freelancers';  // Ajusta la URL a tu servidor si es necesario

// Elemento donde se agregarán las tarjetas
const freelancerList = document.getElementById('freelancer-list');

// Función para generar una tarjeta para cada freelancer
function createFreelancerCard(freelancer) {
    return `
        <div class="bg-white rounded-lg shadow-md p-4">
            <h2 class="text-xl font-semibold mb-2">${freelancer.name}</h2>
            <p class="text-gray-600">${freelancer.skill}</p>
            <p class="text-gray-500 text-sm">${freelancer.email}</p>
        </div>
    `;
}

// Función para obtener los freelancers desde la API
async function getFreelancers() {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Autenticación con token
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los freelancers');
        }

        const freelancers = await response.json();

        // Limpiar la lista de freelancers
        freelancerList.innerHTML = '';

        // Generar tarjetas para cada freelancer
        freelancers.forEach(freelancer => {
            const cardHTML = createFreelancerCard(freelancer);
            freelancerList.insertAdjacentHTML('beforeend', cardHTML);
        });
    } catch (error) {
        console.error('Error:', error);
        freelancerList.innerHTML = '<p class="text-red-500">Error al cargar los freelancers</p>';
    }
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', getFreelancers);
