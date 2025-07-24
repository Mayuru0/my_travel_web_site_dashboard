import { Timestamp } from "firebase/firestore";
export type CategoryType = {
  id?: string;             
  title: string; 
  province: string;            
  description: string;     
  coverImgUrl: string;      
 createdAt: Timestamp;
          
};
