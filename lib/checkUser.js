//whenever user login we need to take user data and add in our database *User Table*

//------
// checking user is logged in or not

import { clerkClient, currentUser } from "@clerk/nextjs/server";

import { db } from "@/lib/prismadb";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  //check whether the user is already in our DB.. if yes return else if its firsttime 1. add default name to dispaly 2. add the user to db
  try {
    //check whether the user is in DB
    const loggedInUser = await db?.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName} ${user.lastName}`;

    //1.set a default name

    // const response = await clerkClient().users.updateUser(user?.id, {
    //   username: name.split(" ").join("-") + user?.id.slice(-4),
    // });
    // console.log("Username set====>", response);
    //2. add the user in db

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
        username: name.split(" ").join("-") + user.id.slice(-4),
      },
    });

    return newUser;
  } catch (error) {
    console.log(error);
  }
};
