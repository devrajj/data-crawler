import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { crawlUrl } from "../../utils/networkUtils";
import ErrorModal from "../../shared/ErrorModal";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const CrawlContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Tab = styled.div`
  flex: 1;
  padding: 10px;
  text-align: center;
  background-color: ${(props) => (props.active ? "#007bff" : "#ccc")};
  color: ${(props) => (props.active ? "#fff" : "#000")};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.active ? "#0056b3" : "#ddd")};
  }
`;

const Section = styled.div`
  display: ${(props) => (props.active ? "block" : "none")};
  animation: ${fadeIn} 0.5s ease;
`;

const Input = styled.input`
  width: calc(100% - 80px);
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 8px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: ${(props) =>
    !(props.urlInput || props.queryText) ? "not-allowed" : "pointer"};
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

function Crawler() {
  const [activeTab, setActiveTab] = useState("crawl");
  const [urlInput, setUrlInput] = useState("");
  const [crawlResult, setCrawlResult] = useState("");
  const [queryText, setQueryText] = useState("");
  const [error, setError] = useState("");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const closeErrorModal = () => {
    setError("");
    setUrlInput("");
    setQueryText("");
    setCrawlResult("");
  };

  const handleCrawl = async () => {
    if (urlInput) {
      try {
        const res = await crawlUrl({ url: urlInput });
        if (res && res.data && res.data.ok && res.data.data) {
          setCrawlResult(res.data.data);
        } else {
          setError(res.data.err);
        }
      } catch (err) {
        setError("Something went wrong");
      }
    }
  };

  const handleQuery = async () => {
    console.log("inside query", queryText);
  };

  return (
    <CrawlContainer>
      <Title>URL Crawler and Text Query</Title>

      <TabContainer>
        <Tab
          active={activeTab === "crawl"}
          onClick={() => handleTabClick("crawl")}
        >
          Crawl URL
        </Tab>
        <Tab
          active={activeTab === "query"}
          onClick={() => handleTabClick("query")}
        >
          Query Text
        </Tab>
      </TabContainer>

      <Section active={activeTab === "crawl"}>
        <Input
          type="text"
          placeholder="Enter URL"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
        />
        <Button
          urlInput={urlInput.trim()}
          disabled={!urlInput.trim()}
          onClick={handleCrawl}
        >
          Crawl
        </Button>
      </Section>

      <Section active={activeTab === "query"}>
        <Input
          type="text"
          placeholder="Enter text to query"
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
        />
        <Button
          urlInput={queryText.trim()}
          disabled={!queryText.trim()}
          onClick={handleQuery}
        >
          Query
        </Button>
      </Section>
      {crawlResult && (
        <ErrorModal
          title={""}
          text={"Successfully crawled the URL"}
          isError={false}
          customAction={closeErrorModal}
        />
      )}
      {error && <ErrorModal text={error} customAction={closeErrorModal} />}
    </CrawlContainer>
  );
}

export default Crawler;
