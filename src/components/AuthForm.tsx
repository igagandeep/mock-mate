"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "@/components/FormField";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "@firebase/auth";
// import { auth } from '@/firebase/client';
// import { signIn, signUp } from '@/lib/actions/auth.action';
import { useState } from "react";
import Spinner from "./Spinner";
import { loginUser, registerUser } from "@/api/auth";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
      if (type === "sign-up") {
        const { name, email, password } = values;
        let userCredentials;
        try {
          userCredentials = await registerUser({
            name: name!,
            email,
            password,
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          let msg = "Failed to create account. Please try again.";
          if (e.code === "auth/email-already-in-use") {
            msg = "This email is already in use.";
          } else if (e.code === "auth/invalid-email") {
            msg = "That email address is invalid.";
          } else if (e.code === "auth/weak-password") {
            msg = "Password is too weak (min 6 chars).";
          }
          toast.error(msg);
          return;
        }

        if (!userCredentials?.success) {
          toast.error(userCredentials.message);
          return;
        }

        toast.success(userCredentials?.message);
        router.push("/sign-in");
      } else {
        const { email, password } = values;

        let loginResponse;
        try {
          loginResponse = await loginUser({
            email,
            password,
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          let msg = "Sign in failed. Please try again.";
          if (e.code === "auth/user-not-found") {
            msg = "No account found with this email.";
          } else if (e.code === "auth/wrong-password") {
            msg = "Incorrect password.";
          } else if (e.code === "auth/invalid-email") {
            msg = "Invalid email address.";
          } else if (e.code === "auth/too-many-requests") {
            msg = "Too many attempts—please wait a moment.";
          }
          toast.error(msg);
          return;
        }

        if (!loginResponse || !loginResponse.token) {
          toast.error("Login failed: Invalid response from server.");
          return;
        }

        localStorage.setItem("token", loginResponse.token);

        localStorage.setItem("user", JSON.stringify(loginResponse.user));

        toast.success("Logged in successfully!");
        router.push("/");
      }
    } catch (error) {
      toast.error(`There was an error: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[480px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <h2 className="text-center">{isSignIn ? "Sign In" : "Sign Up"}</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
                type="text"
              />
            )}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />

            <Button
              className="btn flex items-center justify-center"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <Spinner />
              ) : isSignIn ? (
                "Sign in"
              ) : (
                "Create an Account"
              )}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </div>
    </div>
  );
};
export default AuthForm;
