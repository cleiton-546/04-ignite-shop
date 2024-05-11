import { AppProps } from "next/app"
import { globalStyles } from "../styles/global"

import LogoImg from '../assets/logo.svg'

import Image from "next/image"
import { Container, Header } from "../styles/pages/app"
import { CartProvider } from "use-shopping-cart"


globalStyles()


function App({ Component, pageProps}: AppProps) {
   

    return (
        <Container>
            <CartProvider
                cartMode="checkout-session"
                stripe=""
                currency="USD"
                loading={<p aria-live="polite">Loading redux-persist...</p>}
                shouldPersist={true}
            
            >
            <Header>
                <Image src={LogoImg} alt=""/>
               

            </Header>
            <Component {...pageProps} />
            </CartProvider>   
        </Container>
    ) 
}


export default App