# TMS

## Overview

The TMS Processor is a service that receives transactions from the client and forwards them to the Data Preparation Service.

Here's a brief explanation of each participant:

- Client: The client initiates requests to the TMS Processor.
- Monitor Quote: This function processes Pain001V11 transactions, which represent quotes.
- Monitor Transfer: This function processes Pacs008V10 transactions, which represent transfers.
- Reply Quote: This function processes Pain01300109 transactions, which represent quote replies.
- Transfer Response: This function processes Pacs00200112V11 transactions, which represent transfer responses.
- Send To Data Preparation: This function sends the processed transactions to the Data Preparation Service for further processing.
- Data Preparation Service: This service receives the transaction and performs further processing on it.

## Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    participant Client as Client
    participant MonitorQuote as Monitor Quote
    participant MonitorTransfer as Monitor Transfer
    participant ReplyQuote as Reply Quote
    participant TransferResponse as Transfer Response
    participant SendToDataPreparation as Send To Data Preparation
    participant DataPreparationService as Data Preparation Service

    Note over Client: The Client initiates requests to the TMS Processor.

    Note over MonitorQuote: Monitor Quote processes Pain001V11 transactions (Quotes).

    Client->>MonitorQuote: call(ctx)
    MonitorQuote->>+SendToDataPreparation: call(transaction, '/execute')
    SendToDataPreparation->>DataPreparationService: POST request

    Note over DataPreparationService: Data Preparation Service receives the transaction for processing.

    SendToDataPreparation-->>MonitorQuote: response
    MonitorQuote-->>Client: response

    Note over MonitorTransfer: Monitor Transfer processes Pacs008V10 transactions (Transfers).

    Client->>MonitorTransfer: call(ctx)
    MonitorTransfer->>+SendToDataPreparation: call(transaction, '/transfer')
    SendToDataPreparation->>DataPreparationService: POST request
    SendToDataPreparation-->>MonitorTransfer: response
    MonitorTransfer-->>Client: response

    Note over ReplyQuote: Reply Quote processes Pain01300109 transactions (Quote Replies).

    Client->>ReplyQuote: call(ctx)
    ReplyQuote->>+SendToDataPreparation: call(transaction, '/quoteReply')
    SendToDataPreparation->>DataPreparationService: POST request
    SendToDataPreparation-->>ReplyQuote: response
    ReplyQuote-->>Client: response

    Note over TransferResponse: Transfer Response processes Pacs00200112V11 transactions (Transfer Responses).

    Client->>TransferResponse: call(ctx)
    TransferResponse->>+SendToDataPreparation: call(transaction, '/transfer-response')
    SendToDataPreparation->>DataPreparationService: POST request
    SendToDataPreparation-->>TransferResponse: response
    TransferResponse-->>Client: response

```
