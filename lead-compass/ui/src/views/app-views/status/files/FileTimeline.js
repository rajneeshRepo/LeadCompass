import React from "react";
import { Popover, Steps } from "antd";
const customDot = (dot, { status, index }) => (
  <Popover
    content={
      <span>
        step {index} status: {status}
      </span>
    }
  >
    {dot}
  </Popover>
);

const description = "Waiting";

const FileTimeline = ({ metadata }) => {
  const formatDate = (date) => {
    const dateObject = Date.parse(date);
    const formattedDate = dateObject.toString("dd MMM yyyy");
    const formattedTime = dateObject.toString("h:mm tt");

    return (
        <span className="text-nowrap">{formattedDate} ({formattedTime})</span>
    );
  };

  const items = [
    {
      title: "Raw",
      description,
    },
    {
      title: "Bronze",
      description,
    },
    {
      title: "Silver",
      description,
    },
    {
      title: "Gold",
      description: "Waiting",
    },
  ];

  let current = 0;

  if (metadata.bronze) {
    current+=2;
    items[0].description = formatDate(metadata.bronze.created_at);
    items[1].description = formatDate(metadata.bronze.created_at);
  }

  if (metadata.silver){
    current++;
    items[2].description = formatDate(metadata.silver.created_at);
  }

  if (metadata.gold){
    current++;
    items[3].description = formatDate(metadata.gold.created_at);
  }

  return (
    <Steps
      size="small"
      current={current}
      progressDot={customDot}
      items={items}
    />
  );
};

export default FileTimeline;
