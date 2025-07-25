"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "./ui/button";
import Spinner from "./Spinner";

const LogoutButton = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setLoading(true);
      // Clear auth tokens and user info from storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.clear();
      toast.success("Logged out successfully.");

      router.push("/sign-in");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      className="btn-primary px-4 py-2 text-white bg-primary-500 w-20 hover:bg-primary-600 rounded"
    >
      {loading ? <Spinner /> : "Logout"}
    </Button>
  );
};

export default LogoutButton;
