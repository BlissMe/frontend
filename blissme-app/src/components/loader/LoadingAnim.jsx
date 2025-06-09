import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import React from "react";

const LoadingAnim = () => {
  return (
    <Spin
      indicator={
        <LoadingOutlined
          style={{
            fontSize: 32,
            color: "linear-gradient(103.13deg, #43B0FF 0.95%, #67FF31 159.39%)",
          }}
          spin
        />
      }
    />
  );
};

export default LoadingAnim;
