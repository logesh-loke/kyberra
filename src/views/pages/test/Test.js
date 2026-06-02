import React from "react";
import axiosInstance from "src/api/Api";
import { useMutation } from "@tanstack/react-query";
import { encripttext, encriptfile } from "src/utils/encryptUtils";
import { decripttext } from "src/utils/decryptUtils";
import { compressText } from "src/utils/compressUtils";
import { decompressText } from "src/utils/deCompressUtils";
import Test1 from "./Test1";

// import GenerateAndStoreMasterKey from "../generate-key/GenerateKey";

const Test = () => {
  const payloadcheck = (payload) =>
    axiosInstance.post("/auth/payloadcheck", payload);

  const { mutate: payloadmutate } = useMutation({
    mutationKey: ["payloadcheck"],
    mutationFn: payloadcheck,
  });

  return (
    <div>
      <p>file upload test</p>
      <Test1 />

      <input type="file" multiple className=' border border-gray-300 p-2 rounded-md  m-2' />
    </div>
  );
};

export default Test;
