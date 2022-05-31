import React from "react";
import styles from "./cohort-builder.css";
import { PatientGetter } from "./patient-getter/patient-getter";
import { Boxes } from "./boxes/slot/boxes";
import { Tabs, Tab } from "carbon-components-react";

const tabs: { name: string; component: JSX.Element }[] = [
  {
    name: "Concepts",
    component: <Boxes />,
  },
  {
    name: "Demographics",
    component: <PatientGetter />,
  },
  {
    name: "Encounters",
    component: <Boxes />,
  },
  {
    name: "Enrollments",
    component: <PatientGetter />,
  },
  {
    name: "Drug Order",
    component: <Boxes />,
  },
  {
    name: "SQL",
    component: <PatientGetter />,
  },
  {
    name: "Composition",
    component: <Boxes />,
  },
  {
    name: "Saved",
    component: <PatientGetter />,
  },
  {
    name: "Search History",
    component: <Boxes />,
  },
  {
    name: "Cohort Results",
    component: <PatientGetter />,
  },
];

const CohortBuilder: React.FC = () => {
  return (
    <div className={`omrs-main-content ${styles.container}`}>
      <Tabs>
        {tabs.map(
          (tab: { name: string; component: JSX.Element }, index: number) => (
            <Tab key={index} label={tab.name}>
              {tab.component}
            </Tab>
          )
        )}
      </Tabs>
      {/* PatientGetter: demonstrates data fetching */}
      {/* <PatientGetter /> */}
      {/* Boxes: demonstrates the extension system */}
      {/* <Boxes /> */}
    </div>
  );
};

export default CohortBuilder;
