import React from 'react'
import Head from "next/head";

interface PropsType {
      title: string;
      description?: string;
      url?: string;
      image?: string;
}

const HeadMeta = ({ title, description, url, image }: PropsType) => {
	return (
    <Head>
      <title>{title || "J 쇼핑몰"}</title>
      <meta name="description"
        content={description || "J 쇼핑몰에 방문하신것을 환영합니다!"}
      />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta property="og:title" content={title || "J 쇼핑몰"} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url || "https://shopping-react-ece42.firebaseapp.com"} />
      <meta property="og:image" content={image || "https://i.ibb.co/7g94dTY/shopping-bg.png"} />
		</Head>
  );
}

export default HeadMeta