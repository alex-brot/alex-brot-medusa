import { AbstractPaymentProvider } from "@medusajs/framework/utils";
import {
    CreatePaymentProviderSession,
  Logger,
  PaymentProviderError,
  PaymentProviderSessionResponse,
  PaymentSessionStatus,
  ProviderWebhookPayload,
  UpdatePaymentProviderSession,
  WebhookActionResult,
} from "@medusajs/framework/types";

type InjectedDependencies = { logger: Logger };

type Options = {
  apiKey: string;
};

class CustomPaymentProviderService extends AbstractPaymentProvider<Options> {
  authorizePayment(paymentSessionData: Record<string, unknown>, context: Record<string, unknown>): Promise<PaymentProviderError | { status: PaymentSessionStatus; data: PaymentProviderSessionResponse["data"]; }> {
      throw new Error("Method not implemented.");
  }
  cancelPayment(paymentData: Record<string, unknown>): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
      throw new Error("Method not implemented.");
  }
  initiatePayment(context: CreatePaymentProviderSession): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
      throw new Error("Method not implemented.");
  }
  deletePayment(paymentSessionData: Record<string, unknown>): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
      throw new Error("Method not implemented.");
  }
  getPaymentStatus(paymentSessionData: Record<string, unknown>): Promise<PaymentSessionStatus> {
      throw new Error("Method not implemented.");
  }
  refundPayment(paymentData: Record<string, unknown>, refundAmount: number): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
      throw new Error("Method not implemented.");
  }
  retrievePayment(paymentSessionData: Record<string, unknown>): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
      throw new Error("Method not implemented.");
  }
  updatePayment(context: UpdatePaymentProviderSession): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
      throw new Error("Method not implemented.");
  }
  getWebhookActionAndData(data: ProviderWebhookPayload["payload"]): Promise<WebhookActionResult> {
      throw new Error("Method not implemented.");
  }
  static identifier = "my-payment";
  protected logger_: Logger;
  protected options_: Options;

  constructor({ logger }: InjectedDependencies, options: Options) {
    // @ts-ignore
    super(...arguments);

    this.logger_ = logger;
    this.options_ = options;
    this.logger_.info(
      "###############Custom Payment Provider Loaded##################"
    );
  }

  async capturePayment(
    paymentData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    const externalId = paymentData.id;

    try {
      // const newData = await this.client.capturePayment(externalId)
      this.logger_.info(
        "###########About to print payment info#################"
      );
      this.logger_.info(JSON.stringify(paymentData));
      this.logger_.info("##########Payment info printed################");

      return {
        id: externalId,
      };
    } catch (e) {
      return {
        error: e,
        code: "unknown",
        detail: e,
      };
    }
  }
}

export default CustomPaymentProviderService;
