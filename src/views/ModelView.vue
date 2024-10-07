<template>
  <div class="search-section">
    <a-input-group compact>
      <a-typography-title :level="5">Date:</a-typography-title>
      <a-date-picker
        v-model:value="search_date"
        style="width: 25%; margin-left: 4px; margin-right: 16px"
      />

      <a-typography-title :level="5">Track:</a-typography-title>
      <a-select
        ref="select"
        v-model:value="search_track"
        style="width: 25%; margin-left: 4px; margin-right: 16px"
      >
        <a-select-option
          v-for="(item, index) in trackList"
          :key="index"
          :value="item"
          >{{ item ? item : "None" }}</a-select-option
        >
      </a-select>

      <a-typography-title :level="5">Race:</a-typography-title>
      <a-select
        ref="select"
        v-model:value="search_race"
        style="width: 25%; margin-left: 4px"
      >
        <a-select-option
          v-for="(item, index) in raceList"
          :key="index"
          :value="item.id_race"
          >{{ item.race_no }}</a-select-option
        >
      </a-select>

      <download-excel
        class="btn btn-default"
        :data="dataList"
        :fields="json_fields"
        worksheet="Worksheet1"
        :name="'Race-' + search_race"
        style="margin-left: 20px"
        v-if="search_race"
      >
        <a-button type="primary" size="large"> Download </a-button>
      </download-excel>
    </a-input-group>
  </div>

  <a-table
    :columns="columns"
    :row-key="(record) => record.id_run"
    :data-source="dataList || []"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
    :scroll="{ x: '100%' }"
  >
    <template
      #customFilterDropdown="{
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        column,
      }"
    >
      <div style="padding: 8px">
        <a-input
          ref="searchInput"
          :placeholder="`Search ${column.dataIndex}`"
          :value="selectedKeys[0]"
          :type="column.dataIndex === 'meeting_date' ? 'date' : 'text'"
          style="width: 188px; margin-bottom: 8px; display: block"
          @change="
            (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
          "
          @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
        />

        <a-button
          type="primary"
          size="small"
          style="width: 90px; margin-right: 8px"
          @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
        >
          <template #icon><SearchOutlined /></template>
          Search
        </a-button>
        <a-button
          size="small"
          style="width: 90px"
          @click="handleReset(clearFilters)"
        >
          Reset
        </a-button>
      </div>
    </template>

    <template #customFilterIcon="{ filtered }">
      <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
    </template>

    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'meeting_date'">
        <span> {{ $moment(text).format("DD MMM YYYY") }}</span>
      </template>

      <template v-if="column.dataIndex === 'race_no'">
        <span :style="{ display: 'flex' }">
          {{ text }}
          <a-button
            type="circle"
            size="small"
            :loading="raceChartLoading === text"
            @click="handleOpenRaceChartModal(record.id_race)"
          >
            <template #icon><BarChartOutlined /></template>
          </a-button>
        </span>
      </template>

      <template v-if="column.dataIndex === 'runner_id'">
        <span :style="{ display: 'flex' }">
          {{ text }}
          <a-button
            type="circle"
            size="small"
            :loading="runnerChartLoading === text"
            @click="handleOpenRunnerChartModal(text)"
          >
            <template #icon><BarChartOutlined /></template>
          </a-button>
        </span>
      </template>

      <template v-if="column.extra">
        <a-typography-text type="success" strong v-if="text"
          >TRUE</a-typography-text
        >
        <a-typography-text type="danger" v-else>false</a-typography-text>
      </template>
    </template>
  </a-table>

  <a-modal
    v-model:open="raceOpen"
    width="100%"
    height="500px"
    centered
    @ok="handleCloseModal"
  >
    <a-space>
      <a-select
        ref="select"
        v-model:value="chartY"
        style="width: 120px"
        @focus="focus"
        @change="handleChangeChartY"
      >
        <a-select-option value="tp20r">TP20R</a-select-option>
        <a-select-option value="rpr">RPR</a-select-option>
        <a-select-option value="pfs">PFS</a-select-option>
        <a-select-option value="l200c">L200C</a-select-option>
        <a-select-option value="cd">CD</a-select-option>
        <a-select-option value="l20">L20</a-select-option>
        <a-select-option value="dr">DR</a-select-option>
        <a-select-option value="weight">Weight</a-select-option>
        <a-select-option value="jts">JTS</a-select-option>
        <a-select-option value="win_prob">Win Prob</a-select-option>
      </a-select>
    </a-space>
    <Bar
      :data="chartData"
      :options="{
        responsive: true,
        maintainAspectRatio: false,
      }"
    />
  </a-modal>

  <a-modal
    v-model:open="runnerOpen"
    width="100%"
    height="500px"
    centered
    @ok="handleCloseModal"
  >
    <a-space>
      <a-select
        ref="select"
        v-model:value="chartY"
        style="width: 120px"
        @focus="focus"
        @change="handleChangeChartY"
      >
        <a-select-option value="tp20r">TP20R</a-select-option>
        <a-select-option value="rpr">RPR</a-select-option>
        <a-select-option value="pfs">PFS</a-select-option>
        <a-select-option value="l200c">L200C</a-select-option>
        <a-select-option value="cd">CD</a-select-option>
        <a-select-option value="l20">L20</a-select-option>
        <a-select-option value="dr">DR</a-select-option>
        <a-select-option value="weight">Weight</a-select-option>
        <a-select-option value="jts">JTS</a-select-option>
        <a-select-option value="win_prob">Win Prob</a-select-option>
      </a-select>
    </a-space>
    <Bar
      :data="chartData"
      :options="{
        responsive: true,
        maintainAspectRatio: false,
      }"
    />
  </a-modal>
</template>

<script>
import { computed, ref, reactive, onMounted, watch } from "vue";
import { SearchOutlined, BarChartOutlined } from "@ant-design/icons-vue";
import { usePagination } from "vue-request";
import { useAuth0 } from "@auth0/auth0-vue";
import axios from "axios";
import moment from "moment";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default {
  components: {
    SearchOutlined,
    BarChartOutlined,
    Bar,
  },

  setup() {
    const { getAccessTokenSilently } = useAuth0();
    const search_date = ref(null);
    const search_track = ref(null);
    const search_race = ref(null);
    const dataList = ref([]);
    const meetingList = ref([]);
    const trackList = ref([]);
    const raceList = ref([]);
    const tableFilter = ref({});
    const tableSort = ref({});
    const raceOpen = ref(false);
    const runnerOpen = ref(false);
    const raceChartLoading = ref("");
    const runnerChartLoading = ref("");
    const chartY = ref("tp20r");
    const chartDataSets = ref([]);
    const chartData = ref({
      labels: [],
      datasets: [],
    });

    watch(search_date, (newValue, oldValue) => {
      // This function is triggered every time search_date changes
      getMeetingData();
      filterListBySearch();
    });

    watch(search_track, (newValue, oldValue) => {
      // This function is triggered every time search_track changes
      getRaceData();
      filterListBySearch();
    });

    watch(search_race, (newValue, oldValue) => {
      // This function is triggered every time search_race changes
      filterListBySearch();
    });

    // Get meeting data for the advanced search
    async function getMeetingData() {
      search_track.value = "";
      search_race.value = "";

      let params = {};
      if (search_date.value) {
        params.meeting_date = moment(search_date.value.$d).format("YYYY-MM-DD");
      }
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/meeting",
        {
          params,
          headers: {
            Authorization: `Bearer ${accessToken.value}`,
          },
        }
      );
      const responseData = response.data;
      if (responseData) {
        meetingList.value = responseData.data;
        let track_list = [];
        responseData.data.forEach((data) => {
          if (track_list.indexOf(data.track_name) === -1)
            track_list.push(data.track_name);
        });
        trackList.value = track_list;
      }
    }

    async function getRaceData() {
      search_race.value = "";
      let raceData = meetingList.value.filter(
        (data) => data.track_name === search_track.value
      );
      let race_list = [];
      raceData.forEach((data) => {
        if (race_list.indexOf(data.id_race) === -1)
          race_list.push({ id_race: data.id_race, race_no: data.race_no });
      });
      raceList.value = race_list;
    }

    function filterListBySearch() {
      // Assuming you have a method to fetch or filter your data:
      const pagination = { current: 1, pageSize: 10 };
      handleTableChange(pagination, tableFilter.value, tableSort.value);
    }

    const searchInput = ref();
    const state = reactive({
      searchText: "",
      searchedColumn: "",
    });
    const columns = [
      {
        title: "id",
        dataIndex: "id_meeting",
        width: 150,
        sorter: true,
        customFilterDropdown: true,
        onFilterDropdownOpenChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              searchInput.value.focus();
            }, 100);
          }
        },
      },
      {
        title: "Date",
        dataIndex: "meeting_date",
        width: 150,
        sorter: true,
      },
      {
        title: "Track",
        dataIndex: "track_name",
        width: 150,
        sorter: true,
      },
      {
        title: "Race",
        dataIndex: "race_no",
        width: 100,
        sorter: true,
      },
      {
        title: "Tab No.",
        dataIndex: "tab_no",
        width: 150,
        sorter: true,
      },
      {
        title: "Win Prob",
        dataIndex: "pwin",
        width: 100,
        sorter: true,
      },
      {
        title: "Price",
        dataIndex: "price",
        width: 100,
        sorter: true,
      },
      {
        title: "Horse",
        dataIndex: "runner_id",
        // dataIndex: "runner",
        width: 150,
        sorter: true,
        customFilterDropdown: true,
        onFilterDropdownOpenChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              searchInput.value.focus();
            }, 100);
          }
        },
      },
      {
        title: "Jockey",
        dataIndex: "jockey",
        width: 150,
        sorter: true,
        customFilterDropdown: true,
        onFilterDropdownOpenChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              searchInput.value.focus();
            }, 100);
          }
        },
      },
      {
        title: "Trainer",
        dataIndex: "trainer",
        width: 150,
        sorter: true,
        customFilterDropdown: true,
        onFilterDropdownOpenChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              searchInput.value.focus();
            }, 100);
          }
        },
      },
      {
        title: "Time Rating Rank",
        dataIndex: "x_tp20r_cent",
        width: 150,
        sorter: true,
      },
      {
        title: "Neural",
        dataIndex: "x_rpr_cent",
        width: 100,
        sorter: true,
      },
      {
        title: "PF Score",
        dataIndex: "x_pfscore_cent",
        width: 150,
        sorter: true,
      },
      {
        title: "Last 200 Class",
        dataIndex: "x_last200cls_lag_cent",
        width: 200,
        sorter: true,
      },
      {
        title: "Class Diff",
        dataIndex: "x_clsdiff_cent",
        width: 150,
        sorter: true,
      },
      {
        title: "Early and Late speed",
        dataIndex: "x_lelt20_cent",
        width: 150,
        sorter: true,
      },
      {
        title: "Rest",
        dataIndex: "x_days_rest_cent",
        width: 150,
        sorter: true,
      },
      {
        title: "Weight",
        dataIndex: "x_weight_cent",
        width: 150,
        sorter: true,
      },
      {
        title: "J+T Strike",
        dataIndex: "x_jt_strike_rate_cent",
        width: 200,
        sorter: true,
      },
      {
        title: "Blink First",
        dataIndex: "x_blinkers_first",
        width: 150,
        sorter: true,
        extra: true,
      },
      {
        title: "Last Go For",
        dataIndex: "x_last_goforward",
        width: 200,
        sorter: true,
        extra: true,
      },
      {
        title: "Jcky Claim",
        dataIndex: "x_jockey_claim",
        width: 150,
        sorter: true,
        extra: true,
      },
      {
        title: "Jcky Claim Go For",
        dataIndex: "x_jock_claim_go_for",
        width: 200,
        sorter: true,
        extra: true,
      },
      {
        title: "Last 200 top 20 Race",
        dataIndex: "x_last_h_l200_20",
        width: 200,
        sorter: true,
        extra: true,
      },
      {
        title: "Last 200 top 20 Meet",
        dataIndex: "x_last_early_late_top20",
        width: 200,
        sorter: true,
        extra: true,
      },
      {
        title: "Quick Back Up",
        dataIndex: "x_quick_back_up",
        width: 150,
        sorter: true,
        extra: true,
      },
    ];

    const accessToken = ref("");

    onMounted(async () => {
      try {
        accessToken.value = await getAccessTokenSilently();
        run();
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    });

    const queryData = async (params) => {
      const TRUE_STR = "true";
      const FALSE_STR = "false";
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/model",
        {
          params,
          headers: {
            Authorization: `Bearer ${accessToken.value}`,
          },
        }
      );
      const responseData = response.data;
      const tableData = responseData?.data?.map((item) => ({
        ...item,
        // x_blinkers_first: item.x_blinkers_first ? TRUE_STR : FALSE_STR,
        // x_jock_claim_go_for: item.x_jock_claim_go_for ? TRUE_STR : FALSE_STR,
        // x_jockey_claim: item.x_jockey_claim ? TRUE_STR : FALSE_STR,
        // x_last_early_late_top20: item.x_last_early_late_top20
        //   ? TRUE_STR
        //   : FALSE_STR,
        // x_last_goforward: item.x_last_goforward ? TRUE_STR : FALSE_STR,
        // x_last_h_l200_20: item.x_last_h_l200_20 ? TRUE_STR : FALSE_STR,
        // x_quick_back_up: item.x_quick_back_up ? TRUE_STR : FALSE_STR,
        price: item.pwin ? (1 / item.pwin).toFixed(2) : 0,
      }));

      return {
        ...responseData,
        data: tableData || [],
      };
    };

    const {
      data: dataSource,
      run,
      loading,
      current,
      pageSize,
      total,
    } = usePagination(queryData, {
      defaultParams: [
        {
          page: 1,
          per_page: 10,
          meeting_date: search_date.value
            ? moment(search_date.value.$d).format("YYYY-MM-DD")
            : "",
          track: search_track.value ? search_track.value : "",
          id_race: search_race.value ? search_race.value : "",
        },
      ],
      pagination: {
        currentKey: "page",
        pageSizeKey: "per_page",
        totalKey: "total",
        totalPageKey: "pages",
      },
    });

    const pagination = computed(() => ({
      total: total.value,
      current: current.value,
      pageSize: pageSize.value,
    }));

    const handleTableChange = (page, filters, sorter) => {
      tableFilter.value = filters;
      tableSort.value = sorter;

      const table_filter = {};
      if (filters.id_meeting && filters.id_meeting.length > 0) {
        table_filter["id_meeting"] = filters.id_meeting[0];
      }
      if (filters.runner_id && filters.runner_id.length > 0) {
        table_filter["runner_id"] = filters.runner_id[0];
      }
      if (filters.jockey && filters.jockey.length > 0) {
        table_filter["jockey"] = filters.jockey[0];
      }
      if (filters.trainer && filters.trainer.length > 0) {
        table_filter["trainer"] = filters.trainer[0];
      }

      run({
        per_page: page.pageSize,
        page: page?.current,
        meeting_date: search_date.value
          ? moment(search_date.value.$d).format("YYYY-MM-DD")
          : "",
        track: search_track.value ? search_track.value : "",
        id_race: search_race.value ? search_race.value : "",
        sort: sorter.field,
        desc: sorter.order === "descend",
        ...table_filter,
      });
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      state.searchText = selectedKeys[0];
      state.searchedColumn = dataIndex;
    };

    const handleReset = (clearFilters) => {
      clearFilters({
        confirm: true,
      });
      state.searchText = "";
    };

    watch(dataSource, (newData, oldData) => {
      if (newData) {
        dataList.value = newData.data; // Assuming dataSource is an array
      }
    });

    const raceChartQueryData = async (params) => {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/model",
        {
          params,
          headers: {
            Authorization: `Bearer ${accessToken.value}`,
          },
        }
      );

      let raceData = [];
      const responseData = response.data;
      responseData?.data?.forEach((item) => {
        raceData.push({
          // runner_id: item.runner_id,
          // x_tp20r_cent: item.x_tp20r_cent,
          // x_rpr_cent: item.x_rpr_cent,
          // x_pfscore_cent: item.x_pfscore_cent,
          // x_last200cls_lag_cent: item.x_last200cls_lag_cent,
          // x_clsdiff_cent: item.x_clsdiff_cent,
          // x_last_early_late_top20: item.x_last_early_late_top20,
          // x_days_rest_cent: item.x_days_rest_cent,
          // x_weight_cent: item.x_weight_cent,
          // x_jt_strike_rate_cent: item.x_jt_strike_rate_cent,
          ...item,
          price: item.pwin ? (1 / item.pwin).toFixed(2) : 0,
        });
      });

      return raceData;
    };

    const handleOpenRaceChartModal = async (raceid) => {
      raceChartLoading.value = raceid;
      const responseData = await raceChartQueryData({
        page: 1,
        per_page: 100,
        id_race: raceid,
      });

      let labels = [];
      let datasets = [
        {
          label: "TP20R for race " + raceid,
          backgroundColor: "#DC143C",
          data: [],
        },
        {
          label: "RPR  for race" + raceid,
          backgroundColor: "#008080",
          data: [],
        },
        {
          label: "PFS for race " + raceid,
          backgroundColor: "#FFD700",
          data: [],
        },
        {
          label: "L200C for race " + raceid,
          backgroundColor: "#6A5ACD",
          data: [],
        },
        {
          label: "CD for race " + raceid,
          backgroundColor: "#FF7F50",
          data: [],
        },
        {
          label: "L20 for race " + raceid,
          backgroundColor: "#808000",
          data: [],
        },
        {
          label: "DR for race " + raceid,
          backgroundColor: "#9370DB",
          data: [],
        },
        {
          label: "Weight for race " + raceid,
          backgroundColor: "#FF8C00",
          data: [],
        },
        {
          label: "JTS for race " + raceid,
          backgroundColor: "#2E8B57",
          data: [],
        },
        {
          label: "Win Prob for race " + raceid,
          backgroundColor: "#BC143C",
          data: [],
        },
      ];

      responseData.forEach((data) => {
        labels.push(data.runner_id);
        datasets[0].data.push(data.x_tp20r_cent);
        datasets[1].data.push(data.x_rpr_cent);
        datasets[2].data.push(data.x_pfscore_cent);
        datasets[3].data.push(data.x_last200cls_lag_cent);
        datasets[4].data.push(data.x_clsdiff_cent);
        datasets[5].data.push(data.x_last_early_late_top20);
        datasets[6].data.push(data.x_days_rest_cent);
        datasets[7].data.push(data.x_weight_cent);
        datasets[8].data.push(data.x_jt_strike_rate_cent);
        datasets[9].data.push(data.pwin);
      });

      chartDataSets.value = datasets;

      chartData.value = {
        labels,
        datasets: [chartDataSets.value[0]],
      };

      raceOpen.value = true;
      raceChartLoading.value = "";
    };

    const runnerChartQueryData = async (params) => {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/model",
        {
          params,
          headers: {
            Authorization: `Bearer ${accessToken.value}`,
          },
        }
      );

      let runnerData = [];
      const responseData = response.data;
      responseData?.data?.forEach((item) => {
        runnerData.push({
          // runner_id: item.runner_id,
          // x_tp20r_cent: item.x_tp20r_cent,
          // x_rpr_cent: item.x_rpr_cent,
          // x_pfscore_cent: item.x_pfscore_cent,
          // x_last200cls_lag_cent: item.x_last200cls_lag_cent,
          // x_clsdiff_cent: item.x_clsdiff_cent,
          // x_last_early_late_top20: item.x_last_early_late_top20,
          // x_days_rest_cent: item.x_days_rest_cent,
          // x_weight_cent: item.x_weight_cent,
          // x_jt_strike_rate_cent: item.x_jt_strike_rate_cent,
          ...item,
          meeting_date: moment(item.meeting_date).format("YYYY-MM-DD"),
          price: item.pwin ? (1 / item.pwin).toFixed(2) : 0,
        });
      });

      return runnerData;
    };

    const handleOpenRunnerChartModal = async (runnerid) => {
      runnerChartLoading.value = runnerid;
      const responseData = await runnerChartQueryData({
        page: 1,
        per_page: 100,
        runner_id: runnerid,
      });

      let labels = [];
      let datasets = [
        {
          label: "TP20R for runner " + runnerid,
          backgroundColor: "#DC143C",
          data: [],
        },
        {
          label: "RPR  for runner" + runnerid,
          backgroundColor: "#008080",
          data: [],
        },
        {
          label: "PFS for runner " + runnerid,
          backgroundColor: "#FFD700",
          data: [],
        },
        {
          label: "L200C for runner " + runnerid,
          backgroundColor: "#6A5ACD",
          data: [],
        },
        {
          label: "CD for runner " + runnerid,
          backgroundColor: "#FF7F50",
          data: [],
        },
        {
          label: "L20 for runner " + runnerid,
          backgroundColor: "#808000",
          data: [],
        },
        {
          label: "DR for runner " + runnerid,
          backgroundColor: "#9370DB",
          data: [],
        },
        {
          label: "Weight for runner " + runnerid,
          backgroundColor: "#FF8C00",
          data: [],
        },
        {
          label: "JTS for runner " + runnerid,
          backgroundColor: "#2E8B57",
          data: [],
        },
        {
          label: "Win Prob for runner " + runnerid,
          backgroundColor: "#5E8B57",
          data: [],
        },
      ];

      responseData.forEach((data) => {
        labels.push(data.meeting_date);
        datasets[0].data.push(data.x_tp20r_cent);
        datasets[1].data.push(data.x_rpr_cent);
        datasets[2].data.push(data.x_pfscore_cent);
        datasets[3].data.push(data.x_last200cls_lag_cent);
        datasets[4].data.push(data.x_clsdiff_cent);
        datasets[5].data.push(data.x_last_early_late_top20);
        datasets[6].data.push(data.x_days_rest_cent);
        datasets[7].data.push(data.x_weight_cent);
        datasets[8].data.push(data.x_jt_strike_rate_cent);
        datasets[8].data.push(data.x_jt_strike_rate_cent);
        datasets[9].data.push(data.pwin);
      });

      chartDataSets.value = datasets;

      chartData.value = {
        labels,
        datasets: [chartDataSets.value[0]],
      };

      runnerOpen.value = true;
      runnerChartLoading.value = "";
    };

    const handleChangeChartY = (value) => {
      chartY.value = value;

      if (value === "tp20r") {
        chartData.value = {
          labels: chartData.value.labels,
          datasets: [chartDataSets.value[0]],
        };
      } else if (value === "rpr") {
        chartData.value = {
          labels: chartData.value.labels,
          datasets: [chartDataSets.value[1]],
        };
      } else if (value === "pfs") {
        chartData.value = {
          labels: chartData.value.labels,
          datasets: [chartDataSets.value[2]],
        };
      } else if (value === "l200c") {
        chartData.value = {
          labels: chartData.value.labels,
          datasets: [chartDataSets.value[3]],
        };
      } else if (value === "cd") {
        chartData.value = {
          labels: chartData.value.labels,
          datasets: [chartDataSets.value[4]],
        };
      } else if (value === "l20") {
        chartData.value = {
          labels: chartData.value.labels,
          datasets: [chartDataSets.value[5]],
        };
      } else if (value === "dr") {
        chartData.value = {
          labels: chartData.value.labels,
          datasets: [chartDataSets.value[6]],
        };
      } else if (value === "weight") {
        chartData.value = {
          labels: chartData.value.labels,
          datasets: [chartDataSets.value[7]],
        };
      } else if (value === "jts") {
        chartData.value = {
          labels: chartData.value.labels,
          datasets: [chartDataSets.value[8]],
        };
      } else if (value === "win_prob") {
        chartData.value = {
          labels: chartData.value.labels,
          datasets: [chartDataSets.value[9]],
        };
      }
    };

    const handleCloseModal = (e) => {
      raceOpen.value = false;
      runnerOpen.value = false;
    };

    const json_fields = {
      id: "id_meeting",
      Date: {
        field: "meeting_date",
        callback: (value) => {
          return moment(value).format("DD MMM YYYY");
        },
      },
      Track: "track_name",
      Race: "race_no",
      "Tab No.": "tab_no",
      "Win Prob": "pwin",
      Price: "price",
      Horse: "runner_id",
      Jockey: "jockey",
      Trainer: "trainer",
      "Time Rating Rank": "x_tp20r_cent",
      Neural: "x_rpr_cent",
      "PF Score": "x_pfscore_cent",
      "Last 200 Class": "x_last200cls_lag_cent",
      "Class Diff": "x_clsdiff_cent",
      "Early and Late speed": "x_lelt20_cent",
      Rest: "x_days_rest_cent",
      Weight: "x_weight_cent",
      "J+T Strike": "x_jt_strike_rate_cent",
      "Blink First": {
        field: "x_blinkers_first",
        callback: (value) => {
          return value ? "TRUE" : "false";
        },
      },
      "Last Go For": {
        field: "x_last_goforward",
        callback: (value) => {
          return value ? "TRUE" : "false";
        },
      },
      "Jcky Claim": {
        field: "x_jockey_claim",
        callback: (value) => {
          return value ? "TRUE" : "false";
        },
      },
      "Jcky Claim Go For": {
        field: "x_jock_claim_go_for",
        callback: (value) => {
          return value ? "TRUE" : "false";
        },
      },
      "Last 200 top 20 Race": {
        field: "x_last_h_l200_20",
        callback: (value) => {
          return value ? "TRUE" : "false";
        },
      },
      "Last 200 top 20 Meet": {
        field: "x_last_early_late_top20",
        callback: (value) => {
          return value ? "TRUE" : "false";
        },
      },
      "Quick Back Up": {
        field: "x_quick_back_up",
        callback: (value) => {
          return value ? "TRUE" : "false";
        },
      },
    };

    return {
      columns,
      search_date,
      search_track,
      search_race,
      trackList,
      raceList,
      raceOpen,
      runnerOpen,
      raceChartLoading,
      runnerChartLoading,
      chartY,
      chartDataSets,
      searchInput,
      state,
      dataSource,
      pagination,
      chartData,
      handleTableChange,
      handleSearch,
      handleReset,
      handleOpenRaceChartModal,
      handleOpenRunnerChartModal,
      handleChangeChartY,
      handleCloseModal,
      loading,
      dataList,

      json_fields,
    };
  },
};
</script>

<style lang="css">
.ant-modal-content {
  height: 100%;
}

.ant-modal-body {
  height: calc(100% - 60px);
}

.ant-modal-footer {
  margin-top: 30px !important;
}

.search-section {
  display: flex;
  justify-content: flex-start;
}

.mr-2 {
  margin-right: 4px;
}

.ml-2 {
  margin-left: 4px;
}
</style>
