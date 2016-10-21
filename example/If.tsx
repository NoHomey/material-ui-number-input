interface IfProps {
    condition: boolean;
    then: JSX.Element;
}

export default function If(props: IfProps): JSX.Element {
    return props.condition ? props.then : null as any as JSX.Element;
}