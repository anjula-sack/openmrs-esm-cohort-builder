import React, { useState } from "react";
import {
  ButtonSet,
  Button,
  DatePicker,
  DatePickerInput,
  Grid,
  Column,
  Dropdown,
  Search,
  CodeSnippetSkeleton,
  NumberInput,
} from "carbon-components-react";
import { getConcepts, search } from "./search-by-concepts.resource";
import "./search-by-concepts.css";
import { JSONHelper } from "./jsonHelper";
import { queryDescriptionBuilder } from "./helpers";

interface Concept {
  uuid: string;
  units: string;
  answers: string[];
  hl7Abbrev: string;
  name: string;
  description: string;
  datatype: any;
}

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
    formToRender: "",
  });
  const jsonHelper = new JSONHelper();

  const onSearch = (search: string) => {
    setIsLoading(true);
    getConcepts(search).then((results) => {
      setSearchResults(results);
      setIsLoading(false);
    });
  };

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

    // this.handleReset();
  };

  return (
    <div>
      Search By Concepts
      <Grid>
        <Column>
          <Search
            closeButtonLabelText="Clear search"
            id="concept-search"
            labelText="Search Concepts"
            onChange={(e) => onSearch(e.target.value)}
            onKeyDown={function noRefCheck() {}}
            onClear={() => setSearchResults([])}
            size="lg"
          />
          <div
            style={{
              maxHeight: 400,
              overflow: "scroll",
              position: "absolute",
              zIndex: 2,
              width: "85%",
              background: "#f0eeee",
            }}
          >
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
        <Column sm={2} md={{ span: 2, offset: 1 }}>
          <Dropdown
            helperText="This is some helper text"
            id="timeModifier"
            onChange={(data) =>
              setObservations({
                ...observations,
                timeModifier: data.selectedItem.value,
              })
            }
            items={[
              {
                id: "option-0",
                text: "Patients who have these observations",
                value: "ANY",
              },
              {
                id: "option-1",
                text: "Patients who do not have these observations",
                value: "NO",
              },
            ]}
            label=""
            titleText=""
          />
        </Column>
        <NumberInput
          helperText="Optional helper text."
          id="carbon-number"
          invalidText="Number is not valid"
          label="NumberInput label"
          max={100}
          min={0}
          size="md"
          value={50}
        />
        <NumberInput
          helperText="Optional helper text."
          id="carbon-number"
          invalidText="Number is not valid"
          label="NumberInput label"
          max={100}
          min={0}
          size="md"
          value={50}
        />
        <Column>Date Range :</Column>
        <Column sm={2} md={{ span: 4, offset: 1 }}>
          <DatePicker datePickerType="range">
            <DatePickerInput
              id="date-picker-input-id-start"
              labelText="Start date"
              placeholder="mm/dd/yyyy"
              size="md"
            />
            <DatePickerInput
              id="date-picker-input-id-finish"
              labelText="End date"
              placeholder="mm/dd/yyyy"
              size="md"
            />
          </DatePicker>
        </Column>
        <Column sm={2} md={{ span: 4, offset: 6 }}>
          <ButtonSet>
            <Button kind="primary" onClick={handleSubmit}>
              Search
            </Button>
            <Button kind="secondary">Reset</Button>
          </ButtonSet>
        </Column>
      </Grid>
    </div>
  );
};
