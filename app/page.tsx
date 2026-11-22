import { redirect } from "next/navigation";

// There is only one restaurant. Visiting the front door takes you to it.
export default function Home() {
  redirect("/restaurant/1");
}
