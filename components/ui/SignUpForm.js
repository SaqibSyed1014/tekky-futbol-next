import {useWeb3Form} from "@/components/ui/useWeb3Form";
import {useState} from "react";

const SHOP_ACCESS_KEY = '54b3a3ce-de65-440b-8d06-001a8490c22c';

export function SignupForm({ type, onSuccess, ctaLabel }) {
    const { submitting, handleSubmit } = useWeb3Form();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    function onSubmit(e) {
        handleSubmit(
            e,
            { access_key: SHOP_ACCESS_KEY, botcheck: '', Type: type, name, email },
            () => { setName(''); setEmail(''); onSuccess(); }
        );
    }

    return (
        <form onSubmit={onSubmit}>
            <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button type="submit" className="cta close-overlay" disabled={submitting}>
                {submitting ? <><span className="spinner" />Submitting</> : ctaLabel}
            </button>
        </form>
    );
}