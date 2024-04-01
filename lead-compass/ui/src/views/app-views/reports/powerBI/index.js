import React from "react";
import { Card } from "antd";

const PowerBIReport = () => {
  return (
    <Card>
      <iframe
        title="Lead Compass"
        width="100%"
        height="700px"
        src="https://app.powerbi.com/reportEmbed?reportId=85432063-7e10-41f5-b5cf-8f53786b2361&autoAuth=true&ctid=85a77b6c-a790-4bcf-8fd6-c1f891dd360b"
        // frameborder="0"
        // allowFullScreen="true"
        placeholder="sdfs"
      ></iframe>
    </Card>
  );
};

export default PowerBIReport;
