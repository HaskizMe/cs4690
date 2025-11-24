import { useParams } from "react-router";

export default function Login() {
    const { school } = useParams();
    return <div>Login {school}</div>;
}
