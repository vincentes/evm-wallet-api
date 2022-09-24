export const TronFeeAction = {
    Transfer(sender : string, contract : string, selector : string, parameter : string) : Action {
        return {
            owner_address: sender,
            contract_address: contract,
            function_selector: selector,
            parameter: parameter
        };
    }
};

export type Action = {
    owner_address: string,
    contract_address: string,
    function_selector: string,
    parameter: string
}