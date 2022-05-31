/**
 * Components that make queries delegate the query-making logic to a
 * `.resource.ts` function. This component simply calls `getPatient`
 * and sets a state variable using the result.
 */

import React, { useState } from "react";
import { Trans } from "react-i18next";
import Button from "carbon-components-react/es/components/Button";
import { TabPanel } from "carbon-components-react/es/components/Tab";
import { Tile } from "carbon-components-react/es/components/Tile";
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "carbon-components-react";
import { getPatient } from "./patient-getter.resource";

const rows = [
  {
    id: "a",
    name: "Load balancer 1",
    status: "Disabled",
  },
  {
    id: "b",
    name: "Load balancer 2",
    status: "Starting",
  },
  {
    id: "c",
    name: "Load balancer 3",
    status: "Active",
  },
];

const headers = [
  {
    key: "name",
    header: "Name",
  },
  {
    key: "status",
    header: "Status",
  },
];
export function PatientGetter() {
  const [patient, setPatient] = useState<fhir.Patient>();
  const patientName = "test";
  return (
    <div>
      <Button onClick={() => getPatient(patientName).then(setPatient)}>
        <Trans key="getPatient">Get a patient named</Trans> 'test'
      </Button>
      <Tile>
        {patient
          ? `${patient.name[0].given} ${patient.name[0].family} / ${patient.gender} / ${patient.birthDate}`
          : null}
      </Tile>
      <DataTable rows={rows} headers={headers}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader {...getHeaderProps({ header })}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow {...getRowProps({ row })}>
                  {row.cells.map((cell) => (
                    <TableCell key={cell.id}>{cell.value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DataTable>
    </div>
  );
}
