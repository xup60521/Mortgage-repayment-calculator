import { describe, expect, it } from "vitest";
import { render, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("vitest is running", () => {
    it("wrong input", async () => {
        render(<App />);
        const amount = screen.getByTestId("mortgage_amount")
        await userEvent.type(amount, "asd51")
        const term = screen.getByTestId("mortgage_term")
        await userEvent.type(term, "25")
        const rate = screen.getByTestId("interest-rate")
        await userEvent.type(rate, "5.25")
        const repayment = screen.getByTestId("repayment")
        await userEvent.click(repayment)

        const submitBtn = screen.getByTestId("form-submit")
        await userEvent.click(submitBtn);

        await waitFor(() => {
            const result = screen.getByText("Results shown here")
            expect(result).toBeInTheDocument()
        });
    })
    it("repayment", async () => {
        render(<App />);
        const amount = screen.getByTestId("mortgage_amount")
        await userEvent.type(amount, "300000")
        const term = screen.getByTestId("mortgage_term")
        await userEvent.type(term, "25")
        const rate = screen.getByTestId("interest-rate")
        await userEvent.type(rate, "5.25")
        const repayment = screen.getByTestId("repayment")
        await userEvent.click(repayment)

        const submitBtn = screen.getByTestId("form-submit")
        await userEvent.click(submitBtn);

        await waitFor(() => {
            const monthly = screen.getByText("£1,797.74")
            const total = screen.getByText("£539,322.94")
            expect(monthly).toBeInTheDocument()
            expect(total).toBeInTheDocument()
        });
    });
    it("interest_only", async () => {
        render(<App />);
        const amount = screen.getByTestId("mortgage_amount")
        await userEvent.type(amount, "300000")
        const term = screen.getByTestId("mortgage_term")
        await userEvent.type(term, "25")
        const rate = screen.getByTestId("interest-rate")
        await userEvent.type(rate, "5.25")
        const repayment = screen.getByTestId("interest_only")
        await userEvent.click(repayment)

        const submitBtn = screen.getByTestId("form-submit")
        await userEvent.click(submitBtn);

        await waitFor(() => {
            const monthly = screen.getByText("£1,312.5")
            const total = screen.getByText("£393,750")
            expect(monthly).toBeInTheDocument()
            expect(total).toBeInTheDocument()
        });
    });
});
