import Header from "../components/Header";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import MobileBar from "../components/MobileBar";
import "../src/App.css";
import NavItems from "../components/NavItems";
import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
} from "@syncfusion/ej2-react-grids";
import { motion } from "framer-motion";

import { getAllUsers } from "../app/appwrite/auth";
import { useEffect } from "react";
import { avatars } from "../app/appwrite/client";
import { formatDate } from "../app/lib/utils";

const {users} = await getAllUsers(10,0)


const AllUsers = () => {
useEffect(()=>{


  
},[])
  return (
    <div className="admin-layout md:pt-10">
      <MobileBar />
      <aside className="w-full max-w-[270px] hidden lg:block">
        <SidebarComponent width={270} enableGestures={false}>
          <NavItems />
        </SidebarComponent>
      </aside>
      <main className="all-users wrapper">
        <Header
          title="Manage Users"
          desc="Filter, sort, and access detailed user profiles"
        />
        <motion.div
                  
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  viewport={{ once: false }}
                >

        <GridComponent dataSource={users} gridLines="None">
          <ColumnsDirective>
            <ColumnDirective
              field="name"
              headerText="Name"
              width={200}
              
              template={(props) => (
                
                
                <div className="flex items-center gap-1.5 px-4">
                  <img
                    src={props.imageUrl ? props.imageUrl : avatars.getInitials()}
                    alt="user"
                    className="rounded-full size-8 aspect-square"
                  />
                  <span>{props.name}</span>
                </div>
              )}
            />
            <ColumnDirective
              field="email"
              headerText="Email Address"
              width={150}
              
            />
            <ColumnDirective
              field="joinedAt"
              headerText="Date Joined"
              width={140}
              
              template={({joinedAt})=> formatDate(joinedAt)}
            />
           
            <ColumnDirective
              field="status"
              headerText="Type"
              width={100}
              
              template={({status})=>(
                <article className={`status-column ${status === `user` ? `bg-success-50` : `bg-light-300`}`}>
                  <div className={`size-1.5 rounded-full ${status === `user` ? `bg-success-500` : `bg-gray-500`}`}/>
                    <h3 className={`font-inter text-sm font-medium ${status === `user` ? `text-success-700` : `text-gray-500`}`}>{status}</h3>
                  
                </article>
              )}
            />
          </ColumnsDirective>
        </GridComponent>
                </motion.div>

      </main>
    </div>
  );
};

export default AllUsers;
