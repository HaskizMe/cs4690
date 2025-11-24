import { useParams } from "react-router";

export default function Dashboard() {
    const { school } = useParams();

    return <div>Dashboard {school}</div>;
}
