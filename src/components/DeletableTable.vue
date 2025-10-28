<script setup>
import { onMounted, watch, ref } from "vue";

const props = defineProps({
    data: Object,
});

const data = ref([...((props.data.value || []))]);

const renderTable = () => {
    props.data.value = [...data.value];
};

function deleteRow(index) {
    data.value.splice(index, 1);
    renderTable();
}

watch(() => props.data.value, (newVal) => {
  if (JSON.stringify(newVal) !== JSON.stringify(data.value)) {
    data.value = [...(newVal || [])];
  }
});
</script>

<template>
  <div class="survey-deletable-table">
    <table class="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr v-if="data.length">
          <th
            v-for="(key, idx) in Object.keys(data[0])"
            :key="idx"
            class="border border-gray-300 bg-gray-100 px-2 py-1 text-left"
          >
            {{ key }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in data"
          :key="rowIndex"
          @click="deleteRow(rowIndex)"
          class="cursor-pointer hover:bg-red-100 transition"
        >
          <td
            v-for="(val, keyIndex) in Object.values(row)"
            :key="keyIndex"
            class="border border-gray-300 px-2 py-1"
          >
            {{ val }}
          </td>
        </tr>

        <tr v-if="!data.length">
          <td colspan="100%" class="text-center py-2 text-gray-500">
            (No rows left)
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.survey-deletable-table table {
  width: 100%;
}
.survey-deletable-table tr {
  transition: background-color 0.2s ease;
}
</style>
