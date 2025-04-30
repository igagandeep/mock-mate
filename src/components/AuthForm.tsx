'use client'

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {Button} from "@/components/ui/button"
import {Form,} from "@/components/ui/form"
import Image from "next/image";
import Link from "next/link";
import {toast} from "sonner";
import FormField from "@/components/FormField";
import {useRouter} from "next/navigation";

const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3)
    })
}
const AuthForm = ({type}: { type: FormType }) => {
    const router = useRouter();
    const formSchema = authFormSchema(type);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (type === 'sign-up') {
                toast.success('Account created successfully')
                router.push("/sign-in")
            } else {
                toast.success('Sign in successfully')
                router.push("/")
            }
        } catch (error) {
            console.log(error);
            toast.error(`There was an error: ${error}`);
        }
    }

    const isSignIn = type === 'sign-in';

    return (
        <div className="card-border lg:min-w-[556px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row items-center justify-center">
                    <Image alt="logo" src="/logo.png" height={32} width={50}/>
                    <h2 className="text-primary-100">MockMate</h2>
                </div>
                <h3 className={"text-center"}>AI That Prepares You Like a Pro</h3>
                <Form {...form}>
                    <form className="w-full space-y-6 mt-4 form" onSubmit={form.handleSubmit(onSubmit)}>
                        {!isSignIn && <FormField
                            control={form.control}
                            name="name"
                            label="Name"
                            placeholder="Enter your name"
                            type="text"
                        />}
                        <FormField
                            control={form.control}
                            name="email"
                            label="Email"
                            placeholder="you@example.com"
                            type="email"
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            label="Password"
                            placeholder="Your password"
                            type="password"
                        />
                        <Button className="btn" type={"submit"}>{isSignIn ? 'Sign in' : 'Create Account'}</Button>

                    </form>
                </Form>
                <p className={"text-center"}>{isSignIn ? 'No account yet' : 'Have an account already'}
                    <Link href={!isSignIn ? '/sign-in' : '/sign-up'}
                          className="font-bold text-user-primary ml-1">
                        {isSignIn ? 'Sign up' : 'Sign in'}
                    </Link>
                </p>
            </div>
        </div>
    )
}
export default AuthForm
