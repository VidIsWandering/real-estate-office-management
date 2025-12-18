"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AccountTab } from "@/components/settings/account/AccountTab";
import { AccountEditForm } from "@/components/settings/account/AccountEditForm";
import { AccountProfileForm } from "@/components/settings/account/AccountProfileForm";

export default function AccountPage() {
    const router = useRouter();
    const mode = useSearchParams().get("mode");

    const account = {
        name: "Jane Doe",
        username: "jane.doe",
        password: "********",
        email: "jane.doe@realestate.com",
        phone: "0909123456",
        role: "Office Manager",
        status: "Active" as const,
    };

    if (mode === "edit") {
        return (
            <AccountEditForm
                initialData={account}
                onSubmit={() => router.push("/settings")}
                onCancel={() => router.push("/settings")}
            />
        );
    }

    if (mode === "profile") {
        return (
            <AccountProfileForm
                account={account}
                onEdit={() =>
                    router.push("/settings/account?mode=edit")
                }
                onBack={() => router.push("/settings")}
            />
        );
    }

    return <AccountTab />;
}
