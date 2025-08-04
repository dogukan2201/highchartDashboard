import { useEffect, useRef, useState } from "react";
import "./style.css";
import Highcharts from "highcharts";
import Dashboards from "@highcharts/dashboards/es-modules/masters/dashboards.src.js";
import "@highcharts/dashboards/es-modules/masters/modules/layout.src.js";
import DataGrid from "@highcharts/dashboards/datagrid";

Highcharts.setOptions({
  accessibility: {
    enabled: false,
  },
});

type DashboardInstance = any;
type DashboardOptions = any;

Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
Dashboards.GridPlugin.custom.connectGrid(DataGrid);
Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);
Dashboards.PluginHandler.addPlugin(Dashboards.GridPlugin);

const config = {
  dataPool: {
    connectors: [
      {
        id: "micro-element",
        type: "JSON",
        options: {
          firstRowAsNames: false,
          columnNames: ["Food", "Vitamin A", "Iron"],
          data: [
            ["Beef Liver", 6421, 6.5],
            ["Lamb Liver", 2122, 6.5],
            ["Cod Liver Oil", 1350, 0.9],
            ["Mackerel", 388, 1],
          ],
        },
      },
    ],
  },
  editMode: {
    enabled: true,
    contextMenu: {
      enabled: true,
      items: ["editMode"],
    },
  },
  gui: {
    layouts: [
      {
        rows: [
          {
            cells: [
              {
                id: "title",
              },
            ],
          },
          {
            cells: [
              {
                id: "kpi-wrapper",
                layout: {
                  rows: [
                    {
                      cells: [
                        {
                          id: "kpi-vitamin-a",
                        },
                        {
                          id: "kpi-iron",
                        },
                      ],
                    },
                  ],
                },
              },
              {
                id: "dashboard-col-0",
              },
              {
                id: "dashboard-col-1",
              },
            ],
          },
          {
            cells: [
              {
                id: "dashboard-col-2",
              },
            ],
          },
        ],
      },
    ],
  },
  components: [
    {
      type: "KPI",
      cell: "kpi-vitamin-a",
      value: 900,
      valueFormat: "{value}",
      title: "Vitamin A",
      subtitle: "daily recommended dose",
    },
    {
      type: "KPI",
      cell: "kpi-iron",
      value: 8,
      title: "Iron",
      valueFormat: "{value}",
      subtitle: "daily recommended dose",
    },
    {
      cell: "title",
      type: "HTML",
      elements: [
        {
          tagName: "h1",
          textContent: "MicroElement amount in Foods",
        },
      ],
    },
    {
      sync: {
        visibility: true,
        highlight: true,
        extremes: true,
      },
      connector: {
        id: "micro-element",
      },
      cell: "dashboard-col-0",
      type: "Highcharts",
      columnAssignment: {
        Food: "x",
        "Vitamin A": "value",
      },
      chartOptions: {
        xAxis: {
          type: "category",
          accessibility: {
            description: "Groceries",
          },
        },
        yAxis: {
          title: {
            text: "mcg",
          },
          plotLines: [
            {
              value: 900,
              zIndex: 7,
              dashStyle: "shortDash",
              label: {
                text: "RDA",
                align: "right",
                style: {
                  color: "#B73C28",
                },
              },
            },
          ],
        },
        credits: {
          enabled: false,
        },
        plotOptions: {
          series: {
            marker: {
              radius: 6,
            },
          },
        },
        legend: {
          enabled: true,
          verticalAlign: "top",
        },
        chart: {
          animation: false,
          type: "column",
          spacing: [30, 30, 30, 20],
        },
        title: {
          text: "",
        },
        tooltip: {
          valueSuffix: " mcg",
          stickOnContact: true,
        },
        lang: {
          accessibility: {
            chartContainerLabel:
              "Vitamin A in food. Highcharts Interactive Chart.",
          },
        },
        accessibility: {
          description: `The chart is displaying the Vitamin A amount in
              micrograms for some groceries. There is a plotLine demonstrating
              the daily Recommended Dietary Allowance (RDA) of 900
              micrograms.`,
          point: {
            valueSuffix: " mcg",
          },
        },
      },
    },
    {
      cell: "dashboard-col-1",
      sync: {
        visibility: true,
        highlight: true,
        extremes: true,
      },
      connector: {
        id: "micro-element",
      },
      type: "Highcharts",
      columnAssignment: {
        Food: "x",
        Iron: "y",
      },
      chartOptions: {
        xAxis: {
          type: "category",
          accessibility: {
            description: "Groceries",
          },
        },
        yAxis: {
          title: {
            text: "mcg",
          },
          max: 8,
          plotLines: [
            {
              value: 8,
              dashStyle: "shortDash",
              label: {
                text: "RDA",
                align: "right",
                style: {
                  color: "#B73C28",
                },
              },
            },
          ],
        },
        credits: {
          enabled: false,
        },
        plotOptions: {
          series: {
            marker: {
              radius: 6,
            },
          },
        },
        title: {
          text: "",
        },
        legend: {
          enabled: true,
          verticalAlign: "top",
        },
        chart: {
          animation: false,
          type: "column",
          spacing: [30, 30, 30, 20],
        },
        tooltip: {
          valueSuffix: " mcg",
          stickOnContact: true,
        },
        lang: {
          accessibility: {
            chartContainerLabel: "Iron in food. Highcharts Interactive Chart.",
          },
        },
        accessibility: {
          description: `The chart is displaying the Iron amount in
              micrograms for some groceries. There is a plotLine demonstrating
              the daily Recommended Dietary Allowance (RDA) of 8
              micrograms.`,
          point: {
            valueSuffix: " mcg",
          },
        },
      },
    },
    {
      cell: "dashboard-col-2",
      connector: {
        id: "micro-element",
      },
      type: "DataGrid",
      editable: true,
      sync: {
        highlight: true,
        visibility: true,
      },
    },
  ],
};

export default function App() {
  const dashboardRef = useRef<DashboardInstance | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [exportMessage, setExportMessage] = useState<string>("");
  const [importMessage, setImportMessage] = useState<string>("");

  const cleanupDashboard = (): void => {
    try {
      if (
        dashboardRef.current &&
        typeof dashboardRef.current.destroy === "function"
      ) {
        dashboardRef.current.destroy();
      }
    } catch (error) {
      console.warn("Dashboard temizleme sırasında hata:", error);
    } finally {
      dashboardRef.current = null;

      const container = document.getElementById("container");
      if (container) {
        container.innerHTML = "";
      }
    }
  };

  const initializeDashboard = (dashboardConfig: DashboardOptions): void => {
    try {
      cleanupDashboard();
      dashboardRef.current = Dashboards.board("container", dashboardConfig);

      console.log("✅ Dashboard başarıyla oluşturuldu");
    } catch (error) {
      console.error("❌ Dashboard oluşturma hatası:", error);
      setExportMessage("❌ Dashboard yüklenirken hata oluştu!");
      setTimeout(() => setExportMessage(""), 3000);
    }
  };

  const handleExportDashboard = (): void => {
    try {
      setIsLoading(true);
      setExportMessage("");

      if (!dashboardRef.current) {
        setExportMessage("❌ Dashboard henüz yüklenmedi!");
        setIsLoading(false);
        return;
      }

      const currentOptions: DashboardOptions =
        dashboardRef.current.getOptions();

      localStorage.setItem(
        "highcharts-dashboards-config",
        JSON.stringify(currentOptions, null, 2)
      );

      setExportMessage(
        "Dashboard yapılandırması başarıyla localStorage'a kaydedildi!"
      );

      console.log("Exported Dashboard Options:", currentOptions);
    } catch (error) {
      console.error("Export hatası:", error);
      setExportMessage("Export işlemi sırasında hata oluştu!");
    } finally {
      setIsLoading(false);
      setTimeout(() => setExportMessage(""), 3000);
    }
  };

  const handleImportDashboard = (): void => {
    try {
      setIsLoading(true);
      setImportMessage("");

      const dashboardsConfig: string | null = localStorage.getItem(
        "highcharts-dashboards-config"
      );

      if (!dashboardsConfig) {
        setImportMessage(
          "LocalStorage'da kayıtlı dashboard yapılandırması bulunamadı!"
        );
        setIsLoading(false);
        return;
      }

      const parsedConfig: DashboardOptions = JSON.parse(dashboardsConfig);

      initializeDashboard(parsedConfig);

      setImportMessage("Dashboard yapılandırması başarıyla içe aktarıldı!");

      console.log("Imported Dashboard Options:", parsedConfig);
    } catch (error) {
      console.error("Import hatası:", error);
      setImportMessage(
        "Import işlemi sırasında hata oluştu! JSON formatı geçersiz olabilir."
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => setImportMessage(""), 3000);
    }
  };

  const handleLocalStorageClear = (): void => {
    localStorage.clear();
    setExportMessage("LocalStorage temizlendi!");
    setImportMessage("LocalStorage temizlendi!");
  };

  useEffect(() => {
    initializeDashboard(config as any);

    return () => {
      cleanupDashboard();
    };
  }, []);

  return (
    <div>
      <div>
        <h2>Dashboard Yönetimi</h2>

        <div className="flex flex-wrap gap-4 mb-4">
          <button
            onClick={handleExportDashboard}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
            aria-label="Dashboard yapılandırmasını dışa aktar"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                İşleniyor...
              </>
            ) : (
              <>Dashboard Export</>
            )}
          </button>

          <button
            onClick={handleImportDashboard}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
            aria-label="Dashboard yapılandırmasını içe aktar"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                İşleniyor...
              </>
            ) : (
              <>Dashboard Import</>
            )}
          </button>
          <button onClick={handleLocalStorageClear}>LocalStorage Clear</button>
        </div>

        {exportMessage && (
          <div
            className={`p-3 rounded-md mb-2 ${
              exportMessage.includes("Dashboard Exported")
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {exportMessage}
          </div>
        )}

        {importMessage && <div>{importMessage}</div>}
      </div>

      <div id="container" />
    </div>
  );
}
