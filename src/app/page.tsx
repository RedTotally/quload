"use client";

import { useEffect, useState } from "react";
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, doc, updateDoc, increment, getDoc } from "firebase/firestore";
import Link from "next/link";

export default function Home() {
  const [fileName, setFileName] = useState("");
  const [count, setCount] = useState<Number>(0)

  const config = {
    apiKey: process.env.NEXT_PUBLIC_APIKEY,
    authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECTID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
    appId: process.env.NEXT_PUBLIC_APPID,
  };

  const app = getApps().length === 0 ? initializeApp(config) : getApp();
  const db = getFirestore(app);

  const generateRandomString = (length: number) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  async function recordNumber() {
    const docRef = doc(db, "QuLoad", "Value_Log");

    updateDoc(docRef, {
      Uploads: increment(1),
    });
  }

  async function fetchNumber() {
    const docRef = doc(db, "QuLoad", "Value_Log");

    const data = (await getDoc(docRef)).data()

    if(data !== undefined){
      setCount(data.Uploads)
    }
  }

  useEffect(() => {
    fetchNumber()
  },[])

  async function copyToClipboard(value: string) {
    navigator.clipboard.writeText(value);
  }

  async function upload(file: File | null) {
    if (!file) {
      return;
    }

    if (file.size > 1073741824) {
      return;
    }

    const newFileName = `QuLoad_${generateRandomString(10)}.${file.name
      .split(".")
      .pop()}`;

    setFileName(newFileName);

    const renamedFile = new File([file], newFileName, { type: file.type });

    console.log(renamedFile.name);

    const formData = new FormData();
    formData.append("file", renamedFile);

    try {
      const response = await fetch("https://quload.com/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Upload successful:", result);
        recordNumber();
        fetchNumber();
      } else {
        console.error("Upload failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  return (
    <>
      <div className="flex justify-center mt-[9em]">
        <div className="lg:w-[60em] px-10">
          <p className="text-center font-semibold text-3xl lg:text-5xl">
            We Don&apos;t Upload, We{" "}
            <span className="font-bold text-[#1F51FF]">QuLoad</span>.
          </p>
          <p className="text-center mt-2">
            Convert a File, Specifically an Image or a Video to a Link in No
            Time.
          </p>

          <div className="mt-10 bg-[#1F51FF] rounded-t-lg p-1 px-2">
            <p className="text-white text-sm">{count.toString()} Files Have Been Hosted</p>
          </div>
          <div className="bg-gray-100 rounded-x-lg rounded-b-lg flex justify-center items-center">
            <input
              onChange={(event) =>
                upload(event.target.files ? event.target.files[0] : null)
              }
              className="h-full w-full rounded-x-lg rounded-b-lg p-[10em] opacity-0 relative z-[50] cursor-pointer"
              type="file"
            ></input>
            <div className="absolute px-20 lg:px-10">
              <div className="flex justify-center">
                <img className="w-[7em] lg:w-[10em]" src="/file.png"></img>
              </div>
              <p className="text-gray-600 text-center">
                Drop a file or simply click here, com&apos;n!
              </p>
              <p className="text-gray-400 text-xs text-center lg:w-[30em] mt-1">
                No registration, payment, or whatever the hell is needed, we
                keep it simple, upload, and a link will be generated.
              </p>
            </div>
          </div>

          <div className="mt-5 flex justify-between items-center bg-gray-100 p-3 rounded-lg">
            <p>https://quload.com/file/{fileName}</p>
            <img
              onClick={() =>
                copyToClipboard(`https://quload.com/file/${fileName}`)
              }
              className="cursor-pointer"
              src="/copy.svg"
            ></img>
          </div>

          <p className="mt-10 text-center text-xs">
            Fun fact, QuLoad stands for &quot;Quick Load&quot;, you know. If
            you&apos;re struggling with the pronunciation, just remember
            we&apos;re cool, so, &quot;Cool Load&quot;, get it?
          </p>

          <div className="mt-20">
            <Link href={"https://github.com/RedTotally/quload"}><img
              className="rounded-lg cursor-pointer hover:brightness-[90%] duration-300"
              src="/banner.png"
            ></img></Link>
          </div>
        </div>
      </div>
    </>
  );
}
