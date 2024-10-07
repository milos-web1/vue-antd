<template>
  <a-table
    :columns="columns"
    :row-key="(record) => record.id_run"
    :data-source="dataSource?.data || []"
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
  </a-table>
</template>

<script setup>
import { computed, ref, reactive, onMounted } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { usePagination } from "vue-request";
import { useAuth0 } from "@auth0/auth0-vue";
import axios from "axios";
const searchInput = ref();
const searchInt = ref();

const { getAccessTokenSilently } = useAuth0();
const accessToken = ref("");  // Define the accessToken as a ref

onMounted(async () => {
  try {
    accessToken.value = await getAccessTokenSilently();  // Update the ref with the token
    run();  // Run the query once the token is available
  } catch (error) {
    console.error("Error fetching access token:", error);
  }
});

const state = reactive({
  searchText: "",
  searchedColumn: "",
});

const columns = [
  {
    title: "id_race",
    dataIndex: "id_race",
    sorter: true,
    width: 200,
  },
  {
    title: "id_run",
    dataIndex: "id_run",
    sorter: true,
    width: 150,
  },
  {
    title: "meeting_id",
    dataIndex: "meeting_id",
    sorter: true,
    width: 150,
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
    title: "meetingdate",
    dataIndex: "meetingdate",
    sorter: true,
    width: 150,
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
    title: "tab_meeting",
    dataIndex: "tab_meeting",
    sorter: true,
    width: 150,
  },
  {
    title: "stage",
    dataIndex: "stage",
    sorter: true,
    width: 150,
  },
  {
    title: "track_name",
    dataIndex: "track_name",
    sorter: true,
    width: 150,
  },
  {
    title: "track_trackId",
    dataIndex: "track_trackId",
    sorter: true,
    width: 150,
  },
  {
    title: "track_location",
    dataIndex: "track_location",
    sorter: true,
    width: 150,
  },
  {
    title: "track_state",
    dataIndex: "track_state",
    sorter: true,
    width: 150,
  },
  {
    title: "track_abbrev",
    dataIndex: "track_abbrev",
    sorter: true,
    width: 150,
  },

  {
    title: "Results",
    children: [
      {
        title: "tab_no",
        dataIndex: "tab_no",
        sorter: true,
        width: 200,
      },
      {
        title: "runner",
        dataIndex: "runner",
        sorter: true,
        width: 200,
      },
      {
        title: "runner_id",
        dataIndex: "runner_id",
        sorter: true,
        width: 200,
      },
      {
        title: "trainer",
        dataIndex: "trainer",
        sorter: true,
        width: 200,
      },
      {
        title: "trainer_id",
        dataIndex: "trainer_id",
        sorter: true,
        width: 200,
      },
      {
        title: "jockey",
        dataIndex: "jockey",
        sorter: true,
        width: 200,
        title: "jockey_id",
        dataIndex: "jockey_id",
        sorter: true,
        width: 200,
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
        title: "jockey_id",
        dataIndex: "jockey_id",
        sorter: true,
        width: 200,
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
        title: "position",
        dataIndex: "position",
        sorter: true,
        width: 200,
      },
      {
        title: "margin",
        dataIndex: "margin",
        sorter: true,
        width: 200,
      },
      {
        title: "barrier",
        dataIndex: "barrier",
        sorter: true,
        width: 200,
      },
      {
        title: "weight",
        dataIndex: "weight",
        sorter: true,
        width: 200,
      },
      {
        title: "in_run",
        dataIndex: "in_run",
        sorter: true,
        width: 200,
      },
      {
        title: "flucs",
        dataIndex: "flucs",
        sorter: true,
        width: 200,
      },
      {
        title: "price",
        dataIndex: "price",
        sorter: true,
        width: 200,
      },
      {
        title: "gearChanges",
        dataIndex: "gearChanges",
        sorter: true,
        width: 200,
      },
      {
        title: "stewards_report",
        dataIndex: "stewards_report",
        sorter: true,
        width: 200,
      },
    ],
  },

  {
    title: "Benchmark",
    children: [
      {
        title: "to600All",
        dataIndex: "to600All",
        sorter: true,
        width: 200,
      },
      {
        title: "last600All",
        dataIndex: "last600All",
        sorter: true,
        width: 200,
      },
      {
        title: "finishAll",
        dataIndex: "finishAll",
        sorter: true,
        width: 200,
      },
      {
        title: "to600Class",
        dataIndex: "to600Class",
        sorter: true,
        width: 200,
      },
      {
        title: "last600Class",
        dataIndex: "last600Class",
        sorter: true,
        width: 200,
      },
      {
        title: "finishClass",
        dataIndex: "finishClass",
        sorter: true,
        width: 150,
      },
      {
        title: "last400All",
        dataIndex: "last400All",
        sorter: true,
        width: 150,
      },
      {
        title: "last200All",
        dataIndex: "last200All",
        sorter: true,
        width: 150,
      },
      {
        title: "last100All",
        dataIndex: "last100All",
        sorter: true,
        width: 150,
      },
      {
        title: "split64All",
        dataIndex: "split64All",
        sorter: true,
        width: 150,
      },
      {
        title: "split42All",
        dataIndex: "split42All",
        sorter: true,
        width: 150,
      },
      {
        title: "split21All",
        dataIndex: "split21All",
        sorter: true,
        width: 150,
      },
      {
        title: "last400Class",
        dataIndex: "last400Class",
        sorter: true,
        width: 150,
      },
      {
        title: "last200Class",
        dataIndex: "last200Class",
        sorter: true,
        width: 150,
      },
      {
        title: "last100Class",
        dataIndex: "last100Class",
        sorter: true,
        width: 150,
      },
      {
        title: "split64Class",
        dataIndex: "split64Class",
        sorter: true,
        width: 150,
      },
      {
        title: "split42Class",
        dataIndex: "split42Class",
        sorter: true,
        width: 150,
      },
      {
        title: "split21Class",
        dataIndex: "split21Class",
        sorter: true,
        width: 150,
      },
    ],
  },

  {
    title: "Ratings",
    children: [
      {
        title: "isReliable",
        dataIndex: "isReliable",
        sorter: true,
        width: 150,
      },
      {
        title: "trackCondition",
        dataIndex: "trackCondition",
        sorter: true,
        width: 150,
      },
      {
        title: "neuralPrice",
        dataIndex: "neuralPrice",
        sorter: true,
        width: 150,
      },
      {
        title: "neuralPriceRank",
        dataIndex: "neuralPriceRank",
        sorter: true,
        width: 150,
      },
      {
        title: "weightClassRank",
        dataIndex: "weightClassRank",
        sorter: true,
        width: 150,
      },
      {
        title: "weightClassPrice",
        dataIndex: "weightClassPrice",
        sorter: true,
        width: 150,
      },
      {
        title: "timeAdjustedWeightClassRank",
        dataIndex: "timeAdjustedWeightClassRank",
        sorter: true,
        width: 150,
      },
      {
        title: "timeAdjustedWeightClassPrice",
        dataIndex: "timeAdjustedWeightClassPrice",
        sorter: true,
        width: 150,
      },
      {
        title: "classChange",
        dataIndex: "classChange",
        sorter: true,
        width: 150,
      },
      {
        title: "pfScore",
        dataIndex: "pfScore",
        sorter: true,
        width: 150,
      },
      {
        title: "predictedSettlePostion",
        dataIndex: "predictedSettlePostion",
        sorter: true,
        width: 150,
      },
      {
        title: "averageHistoricalSettlePosition",
        dataIndex: "averageHistoricalSettlePosition",
        sorter: true,
        width: 150,
      },
      {
        title: "runStyle",
        dataIndex: "runStyle",
        sorter: true,
        width: 150,
      },
      {
        title: "timeRank",
        dataIndex: "timeRank",
        sorter: true,
        width: 150,
      },
      {
        title: "timePrice",
        dataIndex: "timePrice",
        sorter: true,
        width: 150,
      },
      {
        title: "earlyTimeRank",
        dataIndex: "earlyTimeRank",
        sorter: true,
        width: 150,
      },
      {
        title: "earlyTimePrice",
        dataIndex: "earlyTimePrice",
        sorter: true,
        width: 150,
      },
      {
        title: "last600TimeRank",
        dataIndex: "last600TimeRank",
        sorter: true,
        width: 150,
      },
      {
        title: "last600TimePrice",
        dataIndex: "last600TimePrice",
        sorter: true,
        width: 150,
      },
      {
        title: "last400TimeRank",
        dataIndex: "last400TimeRank",
        sorter: true,
        width: 150,
      },
      {
        title: "last400TimePrice",
        dataIndex: "last400TimePrice",
        sorter: true,
        width: 150,
      },
      {
        title: "last200TimeRank",
        dataIndex: "last200TimeRank",
        sorter: true,
        width: 150,
      },
      {
        title: "last200TimePrice",
        dataIndex: "last200TimePrice",
        sorter: true,
        width: 150,
      },
    ],
  },
  {
    title: "Sectionals",
    children: [
      {
        title: "formId",
        dataIndex: "formId",
        sorter: true,
        width: 150,
      },
      {
        title: "timeTo1200",
        dataIndex: "timeTo1200",
        sorter: true,
        width: 150,
      },
      {
        title: "timeTo1000",
        dataIndex: "timeTo1000",
        sorter: true,
        width: 150,
      },
      {
        title: "timeTo800",
        dataIndex: "timeTo800",
        sorter: true,
        width: 150,
      },
      {
        title: "timeTo600",
        dataIndex: "timeTo600",
        sorter: true,
        width: 150,
      },
      {
        title: "timeTo400",
        dataIndex: "timeTo400",
        sorter: true,
        width: 150,
      },
      {
        title: "timeTo200",
        dataIndex: "timeTo200",
        sorter: true,
        width: 150,
      },
      {
        title: "timeTo100",
        dataIndex: "timeTo100",
        sorter: true,
        width: 150,
      },
      {
        title: "timeToFin",
        dataIndex: "timeToFin",
        sorter: true,
        width: 150,
      },
      {
        title: "early200Average",
        dataIndex: "early200Average",
        sorter: true,
        width: 150,
      },
      {
        title: "pos1200",
        dataIndex: "pos1200",
        sorter: true,
        width: 150,
      },
      {
        title: "pos1000",
        dataIndex: "pos1000",
        sorter: true,
        width: 150,
      },
      {
        title: "pos800",
        dataIndex: "pos800",
        sorter: true,
        width: 150,
      },
      {
        title: "pos600",
        dataIndex: "pos600",
        sorter: true,
        width: 150,
      },
      {
        title: "pos400",
        dataIndex: "pos400",
        sorter: true,
        width: 150,
      },
      {
        title: "pos200",
        dataIndex: "pos200",
        sorter: true,
        width: 150,
      },
      {
        title: "pos100",
        dataIndex: "pos100",
        sorter: true,
        width: 150,
      },
      {
        title: "posFin",
        dataIndex: "posFin",
        sorter: true,
        width: 150,
      },
      {
        title: "marg1200",
        dataIndex: "marg1200",
        sorter: true,
        width: 150,
      },
      {
        title: "marg1000",
        dataIndex: "marg1000",
        sorter: true,
        width: 150,
      },
      {
        title: "marg800",
        dataIndex: "marg800",
        sorter: true,
        width: 150,
      },
      {
        title: "marg600",
        dataIndex: "marg600",
        sorter: true,
        width: 150,
      },
      {
        title: "marg400",
        dataIndex: "marg400",
        sorter: true,
        width: 150,
      },
      {
        title: "marg200",
        dataIndex: "marg200",
        sorter: true,
        width: 150,
      },
      {
        title: "marg100",
        dataIndex: "marg100",
        sorter: true,
        width: 150,
      },
      {
        title: "margFin",
        dataIndex: "margFin",
        sorter: true,
        width: 150,
      },
      {
        title: "split1210",
        dataIndex: "split1210",
        sorter: true,
        width: 150,
      },
      {
        title: "split108",
        dataIndex: "split108",
        sorter: true,
        width: 150,
      },
      {
        title: "split86",
        dataIndex: "split86",
        sorter: true,
        width: 150,
      },
      {
        title: "split64",
        dataIndex: "split64",
        sorter: true,
        width: 150,
      },
      {
        title: "split42",
        dataIndex: "split42",
        sorter: true,
        width: 150,
      },
      {
        title: "split21",
        dataIndex: "split21",
        sorter: true,
        width: 150,
      },
      {
        title: "last1200Time",
        dataIndex: "last1200Time",
        sorter: true,
        width: 150,
      },
      {
        title: "last1000Time",
        dataIndex: "last1000Time",
        sorter: true,
        width: 150,
      },
      {
        title: "last800Time",
        dataIndex: "last800Time",
        sorter: true,
        width: 150,
      },
      {
        title: "last600Time",
        dataIndex: "last600Time",
        sorter: true,
        width: 150,
      },
      {
        title: "last400Time",
        dataIndex: "last400Time",
        sorter: true,
        width: 150,
      },
      {
        title: "last200Time",
        dataIndex: "last200Time",
        sorter: true,
        width: 150,
      },
      {
        title: "last100Time",
        dataIndex: "last100Time",
        sorter: true,
        width: 150,
      },
      {
        title: "wides1200",
        dataIndex: "wides1200",
        sorter: true,
        width: 150,
      },
      {
        title: "wides1000",
        dataIndex: "wides1000",
        sorter: true,
        width: 150,
      },
      {
        title: "wides800",
        dataIndex: "wides800",
        sorter: true,
        width: 150,
      },
      {
        title: "wides600",
        dataIndex: "wides600",
        sorter: true,
        width: 150,
      },
      {
        title: "wides400",
        dataIndex: "wides400",
        sorter: true,
        width: 150,
      },
      {
        title: "wides200",
        dataIndex: "wides200",
        sorter: true,
        width: 150,
      },
      {
        title: "wides100",
        dataIndex: "wides100",
        sorter: true,
        width: 150,
      },
      {
        title: "widesFin",
        dataIndex: "widesFin",
        sorter: true,
        width: 150,
      },
      {
        title: "meetingRankTo600",
        dataIndex: "meetingRankTo600",
        sorter: true,
        width: 150,
      },
      {
        title: "meetingRank1210",
        dataIndex: "meetingRank1210",
        sorter: true,
        width: 150,
      },
      {
        title: "meetingRank108",
        dataIndex: "meetingRank108",
        sorter: true,
        width: 150,
      },
      {
        title: "meetingRank86",
        dataIndex: "meetingRank86",
        sorter: true,
        width: 150,
      },
      {
        title: "meetingRank64",
        dataIndex: "meetingRank64",
        sorter: true,
        width: 150,
      },
      {
        title: "meetingRank42",
        dataIndex: "meetingRank42",
        sorter: true,
        width: 150,
      },
      {
        title: "meetingRank21",
        dataIndex: "meetingRank21",
        sorter: true,
        width: 150,
      },
      {
        title: "meetingRank12F",
        dataIndex: "meetingRank12F",
        sorter: true,
        width: 150,
      },
      {
        title: "meetingRank10F",
        dataIndex: "meetingRank10F",
        sorter: true,
        width: 150,
      },
      {
        title: "meetingRank8F",
        dataIndex: "meetingRank8F",
        sorter: true,
        width: 150,
      },
      {
        title: "meetingRank6F",
        dataIndex: "meetingRank6F",
        sorter: true,
        width: 150,
      },
      {
        title: "meetingRank4F",
        dataIndex: "meetingRank4F",
        sorter: true,
        width: 150,
      },
      {
        title: "meetingRank2F",
        dataIndex: "meetingRank2F",
        sorter: true,
        width: 150,
      },
      {
        title: "meetingRank1F",
        dataIndex: "meetingRank1F",
        sorter: true,
        width: 150,
      },
    ],
  },
];
const queryData = async (params) => {
  const TRUE_STR = "true";
  const FALSE_STR = "false";

  const response = await axios.get(import.meta.env.VITE_API_URL + "/pf", {
    params,
    headers: {
      Authorization: `Bearer ${accessToken.value}`,
    },
  });

  console.log("---=pf response===---", response);

  const responseData = response.data;
  const tableData =
    responseData?.data?.map((item) => ({
      ...item,
      tab_meeting: item.tab_meeting ? TRUE_STR : FALSE_STR,
      isReliable: item.isReliable ? TRUE_STR : FALSE_STR,
    })) || [];

  return {
    ...responseData,
    data: tableData,
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
  const tableFilter = {};
  if (filters.meeting_id && filters.meeting_id.length > 0) {
    tableFilter["meeting_id"] = filters.meeting_id[0];
  }
  if (filters.meetingdate && filters.meetingdate.length > 0) {
    tableFilter["meetingdate"] = filters.meetingdate[0];
  }
  if (filters.jockey_id && filters.jockey_id.length > 0) {
    tableFilter["jockey_id"] = filters.jockey_id[0];
  }
  if (filters.trainer_id && filters.trainer_id.length > 0) {
    tableFilter["trainer_id"] = filters.trainer_id[0];
  }
  run({
    per_page: page.pageSize,
    page: page?.current,
    sort: sorter.field,
    sortdesc: sorter.order === "descend",
    ...tableFilter,
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
</script>
