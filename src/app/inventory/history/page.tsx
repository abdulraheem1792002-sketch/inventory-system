import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

export const dynamic = 'force-dynamic'

export default async function HistoryPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return <div>Please log in</div>
    }

    const { data: logs, error } = await supabase
        .from("activity_logs")
        .select("*")
        .eq("user_id", user.id) // Only show logs for this user
        .order("created_at", { ascending: false })
        .limit(100) // Limit to last 100 actions

    if (error) {
        console.error("Error fetching logs:", error)
        return <div>Error loading history</div>
    }

    const getActionColor = (action: string) => {
        switch (action) {
            case "CREATE_ITEM":
            case "BULK_CREATE":
                return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
            case "UPDATE_ITEM":
                return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
            case "DELETE_ITEM":
                return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
            default:
                return "bg-gray-500/10 text-gray-500"
        }
    }

    return (
        <div className="min-h-screen bg-muted/40 p-8">
            <div className="container mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold tracking-tight">Activity History</h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Recent actions performed on your inventory.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Details</TableHead>
                                    <TableHead>Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                                            No activity recorded yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs?.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell>
                                                <Badge variant="secondary" className={getActionColor(log.action)}>
                                                    {log.action.replace("_", " ")}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{log.details}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
