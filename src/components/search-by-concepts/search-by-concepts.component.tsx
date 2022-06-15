import React, { useState } from "react";
import {
  ButtonSet,
  Button,
  DatePicker,
  DatePickerInput,
  Column,
  Dropdown,
  Search,
  CodeSnippetSkeleton,
  NumberInput,
} from "carbon-components-react";
import { getConcepts, search } from "./search-by-concepts.resource";
import { JSONHelper } from "./jsonHelper";
import { queryDescriptionBuilder } from "./helpers";
import styles from "./search-by-concepts.style.css";

interface Concept {
  uuid: string;
  units: string;
  answers: string[];
  hl7Abbrev: string;
  name: string;
  description: string;
  datatype: any;
}

const observationOptions = [
  {
    id: "option-0",
    label: "Patients who have these observations",
    value: "ANY",
  },
  {
    id: "option-1",
    label: "Patients who do not have these observations",
    value: "NO",
  },
];

export const SearchByConcepts: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Concept[]>([]);
  const [concept, setConcept] = useState<Concept>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [observations, setObservations] = useState({
    timeModifier: "ANY",
    question: concept?.uuid,
    operator1: "LESS_THAN",
    modifier: "",
    onOrBefore: "",
    onOrAfter: "",
  });
  const jsonHelper = new JSONHelper();

  const onSearch = (search: string) => {
    setIsLoading(true);
    getConcepts(search).then((results) => {
      setSearchResults(results);
      setIsLoading(false);
    });
  };

  const handleDates = (dates: Date[]) => {};

  const handleSubmit = () => {
    const types = {
      CWE: "codedObsSearchAdvanced",
      NM: "numericObsSearchAdvanced",
      DT: "dateObsSearchAdvanced",
      ST: "dateObsSearchAdvanced",
      TS: "textObsSearchAdvanced",
      ZZ: "codedObsSearchAdvanced",
      BIT: "codedObsSearchAdvanced",
    };
    const { hl7Abbrev, name } = concept;
    const dataType = types[hl7Abbrev];
    const params = { [dataType]: [] };

    Object.keys(observations).forEach((key) => {
      observations[key] !== ""
        ? params[dataType].push({
            name:
              key === "modifier"
                ? ["CWE", "TS"].includes(hl7Abbrev)
                  ? "values"
                  : "value1"
                : key,
            value:
              key === "modifier" && ["CWE", "TS"].includes(hl7Abbrev)
                ? [observations[key]]
                : observations[key],
          })
        : "";
    });

    const searchData = jsonHelper.composeJson(params);

    const description = queryDescriptionBuilder(observations, name);
    search(searchData, description);
  };

  return (
    <div>
      <h5>Search By Concepts</h5>
      <div>
        <Column className={styles.column}>
          <Search
            closeButtonLabelText="Clear search"
            id="concept-search"
            labelText="Search Concepts"
            placeholder="Search Concepts"
            onChange={(e) => onSearch(e.target.value)}
            onKeyDown={function noRefCheck() {}}
            onClear={() => setSearchResults([])}
            size="lg"
          />
          <div className={styles.search}>
            {isLoading ? (
              <CodeSnippetSkeleton type="multi" />
            ) : (
              searchResults.map((concept: Concept) => (
                <div key={concept.uuid}>
                  <Button
                    kind="ghost"
                    onClick={() => {
                      setConcept(concept);
                      setSearchResults([]);
                    }}
                  >
                    {concept.name}
                  </Button>
                  <br />
                </div>
              ))
            )}
          </div>
          {concept && (
            <h5>Patients with observations whose answer is {concept.name}</h5>
          )}
        </Column>
        <Column className={styles.column} sm={2} md={{ span: 4 }}>
          <Dropdown
            id="timeModifier"
            onChange={(data) =>
              setObservations({
                ...observations,
                timeModifier: data.selectedItem.value,
              })
            }
            initialSelectedItem={observationOptions[0]}
            items={observationOptions}
            label=""
            titleText=""
          />
        </Column>
        <Column className={styles.column}>
          <div style={{ display: "flex", alignItems: "center" }}>
            Within the last
            <NumberInput
              id="carbon-number"
              invalidText="Number is not valid"
              min={0}
              size="md"
              value={0}
            />
            months
            <NumberInput
              id="carbon-number"
              invalidText="Number is not valid"
              min={0}
              size="md"
              value={0}
            />
            and/or days
          </div>
        </Column>
        <Column className={styles.column}>
          <p className={styles.dateRange}>Date Range :</p>
          <DatePicker
            datePickerType="range"
            dateFormat="d-m-Y"
            allowInput={false}
            onChange={(dates: Date[]) => handleDates(dates)}
          >
            <DatePickerInput
              id="date-picker-input-id-start"
              labelText="Start date"
              placeholder="DD-MM-YYYY"
              size="md"
            />
            <DatePickerInput
              id="date-picker-input-id-finish"
              labelText="End date"
              placeholder="DD-MM-YYYY"
              size="md"
            />
          </DatePicker>
        </Column>
        <Column sm={2} md={{ span: 4, offset: 4 }} className={styles.column}>
          <ButtonSet className={styles.buttonSet}>
            <Button kind="primary" onClick={handleSubmit}>
              Search
            </Button>
            <Button kind="secondary">Reset</Button>
          </ButtonSet>
        </Column>
      </div>
    </div>
  );
};
