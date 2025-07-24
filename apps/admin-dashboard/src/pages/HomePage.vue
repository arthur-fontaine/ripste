<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard Analytics</h1>
        <p class="text-gray-600">Vue d'ensemble des métriques de transactions</p>
      </div>

      <div v-if="loading" class="flex items-center justify-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <svg class="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          <span class="text-red-800">Erreur lors du chargement des données: {{ error }}</span>
        </div>
      </div>

      <div v-else-if="metrics">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total Transactions</p>
                <p class="text-2xl font-bold text-gray-900">{{ formatNumber(metrics.totalTransactions) }}</p>
              </div>
              <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Volume Total</p>
                <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(metrics.totalVolume) }}</p>
              </div>
              <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Aujourd'hui</p>
                <p class="text-2xl font-bold text-gray-900">{{ formatNumber(metrics.todayTransactions) }}</p>
                <p class="text-sm text-gray-500">{{ formatCurrency(metrics.todayVolume) }}</p>
              </div>
              <div class="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Taux de Succès</p>
                <p class="text-2xl font-bold text-gray-900">{{ metrics.successRate }}%</p>
                <p class="text-sm text-gray-500">Temps moy: {{ metrics.averageProcessingTime }}s</p>
              </div>
              <div class="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg class="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Transactions par Jour</h3>
            <div class="space-y-3">
              <div
                  v-for="(day, _index) in metrics.transactionsByDay"
                  :key="day.date"
                  class="flex items-center justify-between"
              >
                <div class="flex items-center space-x-3 flex-1">
                  <span class="text-sm text-gray-600 w-16">{{ formatDate(day.date) }}</span>
                  <div class="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                        class="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        :style="{ width: getPercentage(day.count, maxDailyTransactions) + '%' }"
                    ></div>
                  </div>
                  <span class="text-sm font-medium text-gray-900 w-12 text-right">{{ day.count }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Répartition par Statut</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-4 h-4 bg-green-500 rounded"></div>
                  <span class="text-sm text-gray-600">Succès</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-24 bg-gray-200 rounded-full h-2">
                    <div
                        class="bg-green-500 h-2 rounded-full"
                        :style="{ width: getStatusPercentage('successful') + '%' }"
                    ></div>
                  </div>
                  <span class="text-sm font-medium w-12 text-right">{{ formatNumber(metrics.transactionsByStatus.successful) }}</span>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-4 h-4 bg-red-500 rounded"></div>
                  <span class="text-sm text-gray-600">Échec</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-24 bg-gray-200 rounded-full h-2">
                    <div
                        class="bg-red-500 h-2 rounded-full"
                        :style="{ width: getStatusPercentage('failed') + '%' }"
                    ></div>
                  </div>
                  <span class="text-sm font-medium w-12 text-right">{{ formatNumber(metrics.transactionsByStatus.failed) }}</span>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span class="text-sm text-gray-600">En attente</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-24 bg-gray-200 rounded-full h-2">
                    <div
                        class="bg-yellow-500 h-2 rounded-full"
                        :style="{ width: getStatusPercentage('pending') + '%' }"
                    ></div>
                  </div>
                  <span class="text-sm font-medium w-12 text-right">{{ formatNumber(metrics.transactionsByStatus.pending) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Évolution du Volume</h3>
            <div class="space-y-3">
              <div
                  v-for="day in metrics.transactionsByDay"
                  :key="day.date + '-volume'"
                  class="flex items-center justify-between"
              >
                <div class="flex items-center space-x-3 flex-1">
                  <span class="text-sm text-gray-600 w-16">{{ formatDate(day.date) }}</span>
                  <div class="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                        class="bg-green-500 h-2 rounded-full transition-all duration-500"
                        :style="{ width: getPercentage(day.volume, maxDailyVolume) + '%' }"
                    ></div>
                  </div>
                  <span class="text-sm font-medium text-gray-900 w-20 text-right">{{ formatCurrency(day.volume) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Types de Transactions</h3>
            <div class="space-y-6">
              <div class="text-center">
                <div class="inline-flex items-center space-x-4">
                  <div class="flex items-center space-x-2">
                    <div class="w-4 h-4 bg-purple-500 rounded"></div>
                    <span class="text-sm text-gray-600">Paiements</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <div class="w-4 h-4 bg-pink-500 rounded"></div>
                    <span class="text-sm text-gray-600">Remboursements</span>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <div>
                  <div class="flex justify-between mb-1">
                    <span class="text-sm text-gray-600">Paiements</span>
                    <span class="text-sm font-medium">{{ formatNumber(metrics.transactionsByType.payment) }}</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-3">
                    <div
                        class="bg-purple-500 h-3 rounded-full transition-all duration-500"
                        :style="{ width: getTypePercentage('payment') + '%' }"
                    ></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between mb-1">
                    <span class="text-sm text-gray-600">Remboursements</span>
                    <span class="text-sm font-medium">{{ formatNumber(metrics.transactionsByType.refund) }}</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-3">
                    <div
                        class="bg-pink-500 h-3 rounded-full transition-all duration-500"
                        :style="{ width: getTypePercentage('refund') + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { apiClient } from "../lib/api";

const loading = ref(true);
const error = ref<string | null>(null);
const metrics = ref<any>(null);

const maxDailyTransactions = computed(() => {
	if (!metrics.value?.transactionsByDay) return 0;
	return Math.max(
		...metrics.value.transactionsByDay.map((day: any) => day.count),
	);
});

const maxDailyVolume = computed(() => {
	if (!metrics.value?.transactionsByDay) return 0;
	return Math.max(
		...metrics.value.transactionsByDay.map((day: any) => day.volume),
	);
});

const totalTransactions = computed(() => {
	if (!metrics.value?.transactionsByStatus) return 0;
	const status = metrics.value.transactionsByStatus;
	return status.successful + status.failed + status.pending;
});

const totalTypes = computed(() => {
	if (!metrics.value?.transactionsByType) return 0;
	const types = metrics.value.transactionsByType;
	return types.payment + types.refund;
});

const formatNumber = (num: number): string => {
	return new Intl.NumberFormat("fr-FR").format(num);
};

const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "EUR",
	}).format(amount);
};

const formatDate = (dateString: string): string => {
	const date = new Date(dateString);
	return date.toLocaleDateString("fr-FR", { month: "short", day: "numeric" });
};

const getPercentage = (value: number, max: number): number => {
	return max > 0 ? (value / max) * 100 : 0;
};

const getStatusPercentage = (status: string): number => {
	if (!metrics.value?.transactionsByStatus) return 0;
	const value = metrics.value.transactionsByStatus[status];
	return totalTransactions.value > 0
		? (value / totalTransactions.value) * 100
		: 0;
};

const getTypePercentage = (type: string): number => {
	if (!metrics.value?.transactionsByType) return 0;
	const value = metrics.value.transactionsByType[type];
	return totalTypes.value > 0 ? (value / totalTypes.value) * 100 : 0;
};

const fetchMetrics = async () => {
	try {
		loading.value = true;
		error.value = null;

		const response = await apiClient.admin.metrics.transactions.$get();
		metrics.value = await response.json();

		console.log("Metrics loaded:", metrics.value);
	} catch (err) {
		error.value =
			err instanceof Error ? err.message : "Une erreur est survenue";
		console.error("Error fetching metrics:", err);
	} finally {
		loading.value = false;
	}
};

onMounted(() => {
	fetchMetrics();
});
</script>