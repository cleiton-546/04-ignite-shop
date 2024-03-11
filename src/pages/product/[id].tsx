import { stripe } from "@/src/lib/stripe";
import { ImageContainer, ProductContainer, ProductDetails } from "@/src/styles/pages/products";
import axios from "axios";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import Stripe from "stripe";

interface ProductProps {
 product: {
  id: string;
  name: string;
  imageUrl: string;
  price: string;
  description: string;
  defaultPriceId: string;
}
}


export default function Product({ product  }: ProductProps) {
  const [isCreatingCheckoutSession,setIsCreatingCheckoutSession ] = useState(false)

  async function handleBuyProduct() {
     try {
      setIsCreatingCheckoutSession(true);
      
      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId,
      })

      const { checkoutUrl } = response.data;

      window.location.href = checkoutUrl

     } catch (error ){
      setIsCreatingCheckoutSession(false)
      alert('Falha ao redirecionar ao checkout!')

     }
  }
   

    return (
      <>
       <Head>
         <title>{product.name} | Ignite shop</title>
       </Head>
       <ProductContainer>
         <ImageContainer>
          <Image src={product.imageUrl} alt="" width={520} height={480}/>

         </ImageContainer>       

         <ProductDetails>
            <h1>{product.name}</h1>

            <span>{product.price}</span>

            <p>{product.description}</p>
            <button disabled={isCreatingCheckoutSession} onClick={handleBuyProduct}>
                Comprar agora
            </button>
         </ProductDetails>
       </ProductContainer>
      </> 
    )
}

export const getStaticPaths: GetStaticPaths = async () => {

  return {
    paths: [
      { params: { id: 'prod_PhVoE0mHi71x8m'}}
    ],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps<any, { id: string}> = async ({ params }) => {
  const productId = params?.id as string;

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price']
  })

  const price = product.default_price as Stripe.Price
  const formattedPrice = price && price.unit_amount ?
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price.unit_amount / 100) : 'Price not available';

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: formattedPrice,
        description: product.description,   
        defaultPriceId: price.id,
      }
    },
    // revalidate: 60 * 60 * 1, // 1 hour
  }
}