#include "/home/git_repos/quasar_source/finance/c_source_files/abstract/custom_constants.h"
#include "/home/git_repos/quasar_source/finance/c_source_files/abstract/simulation_state.h"
#include <stdio.h>
#include <stdlib.h>

inline void initialize_simulation_state(SimulationState * simulation_state, BookOrder * buy_orders, BookOrder * sell_orders) {
    simulation_state->number_of_current_buy_orders   = 0;
    simulation_state->number_of_current_sell_orders  = 0;
    simulation_state->masari_capital                 = 1000;
    simulation_state->btc_capital                    = 0.0;
	simulation_state->net_btc_profit                 = 0.0;
	simulation_state->number_of_buy_orders_executed  = 0;
	simulation_state->number_of_sell_orders_executed = 0;

    int i;
    for (i = 0; i < MAXIMUM_NUMBER_OF_BUY_ORDERS; i++) {
        buy_orders[i].currently_active = FALSE;
    }
    for (i = 0; i < MAXIMUM_NUMBER_OF_SELL_ORDERS; i++) {
        buy_orders[i].currently_active = FALSE;
    }
}

inline int can_place_buy_order(const SimulationState * simulation_state) {
    if (simulation_state->number_of_current_buy_orders < MAXIMUM_NUMBER_OF_BUY_ORDERS) {
        return TRUE;
    }
    return FALSE;
}

inline int can_place_sell_order(const SimulationState * simulation_state) {
    if (simulation_state->number_of_current_sell_orders < MAXIMUM_NUMBER_OF_SELL_ORDERS) {
        return TRUE;
    }
    return FALSE;
}

inline void place_buy_order(const float order_amount, const float order_price, SimulationState * simulation_state, BookOrder * buy_orders) {
    if (order_price <= 0) {
        return;
    }

    int i;
    for (i = 0; i < MAXIMUM_NUMBER_OF_BUY_ORDERS; i++) {
        if (buy_orders[i].currently_active == FALSE) {
            buy_orders[i].currently_active = TRUE;
            buy_orders[i].order_amount = order_amount;
            buy_orders[i].order_price = order_price;
            simulation_state->number_of_current_buy_orders += 1;
            return;
        }
    }
}

inline void place_sell_order(const float order_amount, const float order_price, SimulationState * simulation_state, BookOrder * sell_orders) {
    if (order_price <= 0) {
        return;
    }

    int i;
    for (i = 0; i < MAXIMUM_NUMBER_OF_SELL_ORDERS; i++) {
        if (sell_orders[i].currently_active == FALSE) {
            sell_orders[i].currently_active = TRUE;
            sell_orders[i].order_amount = order_amount;
            sell_orders[i].order_price = order_price;
            simulation_state->number_of_current_sell_orders += 1;
            return;
        }
    }
}

inline void check_if_any_buy_or_sell_orders_should_be_filled(const float current_price, SimulationState * simulation_state, BookOrder * buy_orders, BookOrder * sell_orders) {
    int i;

    for (i = 0; i < MAXIMUM_NUMBER_OF_BUY_ORDERS; i++) {
        if (buy_orders[i].currently_active == TRUE && buy_orders[i].order_price < current_price) {

            buy_orders[i].currently_active = FALSE;

            simulation_state->masari_capital += buy_orders[i].order_amount;
            simulation_state->btc_capital -= buy_orders[i].order_price * buy_orders[i].order_amount;

            simulation_state->number_of_buy_orders_executed += 1;

            // Temporary debugging.
            printf("Buy order executed! Current price{%f}, order amount {%f}, order_price{%f}\n", current_price, buy_orders[i].order_amount, buy_orders[i].order_price);

        }
    }

    for (i = 0; i < MAXIMUM_NUMBER_OF_SELL_ORDERS; i++) {
        if (sell_orders[i].currently_active == TRUE && sell_orders[i].order_price > current_price) {

            sell_orders[i].currently_active = FALSE;

            simulation_state->masari_capital -= sell_orders[i].order_amount;
            simulation_state->btc_capital += sell_orders[i].order_price * sell_orders[i].order_amount;

            simulation_state->number_of_sell_orders_executed += 1;
        }
    }
}