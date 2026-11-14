<script setup>
import { ref, computed, onMounted } from 'vue';
import { getTickets } from '../services/ticketService';

const tickets = ref([]);
const chargement = ref(true);
const erreur = ref(null);

const rechercheTitre = ref('');
const filtreStatut = ref('');
const filtrePriorite = ref('');

onMounted(async function() {
  try {
    chargement.value = true;
    erreur.value = null;
    const reponse = await getTickets();
    tickets.value = reponse.data;
  } catch (e) {
    erreur.value = "Impossible de charger les tickets. Vérifiez que JSON Server est bien démarré sur le port 3000.";
  } finally {
    chargement.value = false;
  }
});

const ticketsFiltres = computed(function() {
  return tickets.value.filter(function(ticket)
   {
    const correspondTitre = ticket.titre.toLowerCase().includes(rechercheTitre.value.toLowerCase());
    const correspondStatut = filtreStatut.value == '' || ticket.statut == filtreStatut.value;
    const correspondPriorite = filtrePriorite.value == '' || ticket.priorite == filtrePriorite.value;
    return correspondTitre && correspondStatut && correspondPriorite;
  });
});

function getClassePriorite(priorite) 
{
  if (priorite == 'Haute') return 'badge priorite-haute';
  if (priorite == 'Moyenne') return 'badge priorite-moyenne';
  return 'badge priorite-basse';
}

function getClasseStatut(statut)
{
  if (statut == 'Ouvert') return 'badge statut-ouvert';
  if (statut == 'En cours') return 'badge statut-encours';
  return 'badge statut-resolu';
}
</script>

<template>
  <div class="container">
    <h1>Suivi des tickets de support</h1>

    <div class="filtres">
      <input 
        type="text" 
        v-model="rechercheTitre" 
        placeholder="Rechercher par titre..." 
      />

      <select v-model="filtreStatut">
        <option value="">Tous les statuts</option>
        <option value="Ouvert">Ouvert</option>
        <option value="En cours">En cours</option>
        <option value="Résolu">Résolu</option>
      </select>

      <select v-model="filtrePriorite">
        <option value="">Toutes les priorités</option>
        <option value="Haute">Haute</option>
        <option value="Moyenne">Moyenne</option>
        <option value="Basse">Basse</option>
      </select>
    </div>

    <div v-if="chargement" class="message">
      Chargement...
    </div>

    <div v-else-if="erreur" class="message erreur">
      {{ erreur }}
    </div>

    <div v-else>
      <p class="compteur">
        Nombre de tickets visibles : <strong>{{ ticketsFiltres.length }}</strong>
      </p>

      <div v-if="ticketsFiltres.length === 0" class="message">
        Aucun ticket ne correspond à vos critères de recherche.
      </div>

      <div v-else class="liste-tickets">
        <div v-for="ticket in ticketsFiltres" :key="ticket.id" class="carte-ticket">
          <div class="entete-ticket">
            <h3>{{ ticket.titre }}</h3>
            <div class="badges">
              <span :class="getClassePriorite(ticket.priorite)" :aria-label="'Priorité : ' + ticket.priorite">
                {{ ticket.priorite }}
              </span>
              <span :class="getClasseStatut(ticket.statut)" :aria-label="'Statut : ' + ticket.statut">
                {{ ticket.statut }}
              </span>
            </div>
          </div>
          <p class="description">{{ ticket.description }}</p>
          <div class="pied-ticket">
            <span>Demandeur : <strong>{{ ticket.demandeur }}</strong></span>
            <span>Date : {{ ticket.dateCreation }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  max-width: 800px;
  margin: 40px auto;
  padding: 25px;
  font-family: Arial, sans-serif;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  color: #333;
}

h1 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.filtres {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.filtres input, .filtres select {
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  flex: 1;
  background-color: #fff;
  color: #333;
  font-size: 14px;
}

.message {
  padding: 15px;
  background-color: #e9ecef;
  border-radius: 6px;
  text-align: center;
  color: #495057;
}

.erreur {
  background-color: #f8d7da;
  color: #842029;
  border: 1px solid #f5c2c7;
}

.compteur {
  margin-bottom: 15px;
  color: #495057;
}

.liste-tickets {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.carte-ticket {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 18px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.02);
  color: #212529;
}

.entete-ticket {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.entete-ticket h3 {
  margin: 0;
  color: #212529;
  font-size: 1.15em;
}

.description {
  color: #495057;
  margin: 10px 0;
}

.badges {
  display: flex;
  gap: 8px;
}

.badge {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8em;
  font-weight: bold;
  color: white;
}

.priorite-haute { background-color: #dc3545; }
.priorite-moyenne { background-color: #fd7e14; }
.priorite-basse { background-color: #28a745; }

.statut-ouvert { background-color: #0d6efd; }
.statut-encours { background-color: #6f42c1; }
.statut-resolu { background-color: #6c757d; }

.pied-ticket {
  display: flex;
  justify-content: space-between;
  font-size: 0.85em;
  color: #6c757d;
  margin-top: 12px;
  border-top: 1px solid #f1f3f5;
  padding-top: 12px;
}
</style>