import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { Link, redirect } from "react-router-dom";
import { loginWithGoogle } from "../app/appwrite/auth";
import { account } from "../app/appwrite/client";

 export async function clientLoader(){
  try{
     const user = await account.get();
     if (!user) {return redirect("/")}
  }catch(e){
    
    console.log('Error during client load' , e)
  }
 }

const SignIn = () => {



  return (
    <main className="auth">
      <section className="size-full glassmorphism flex-center px-6">
        <div className="sign-in-card">
          <header className="header">
            <Link to="/">
              <img
                src="../public/assets/icons/logo.svg"
                alt="logo"
                className="size-[30px]"
              />
            </Link>
            <h1 className="p-28-bold text-dark-100 ">TourVisto</h1>
          </header>
          <article>
            <h2 className="p-28-semibold text-dark-100 text-center">
              Start Your Travel Journey
            </h2>
            <p className="p-18-regular text-center text-gray-100 !leading-7">
              Sign In With Google To Manage Destinations , Itineraries , And
              User Activity With Ease
            </p>
          </article>
          <ButtonComponent
            iconCss="e-search-icon"
            type="button"
            onClick={loginWithGoogle}
            className="button-class !h-11 !w-full "
          >
            <img
              src="../public/assets/icons/google.svg"
              alt="google"
              className="size-5"
            />
            <span className="p-18-semibold text-white ">
              Sign In With Google
            </span>
          </ButtonComponent>
        </div>
      </section>
    </main>
  );
};

export default SignIn;
